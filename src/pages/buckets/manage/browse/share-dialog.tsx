import { createDisclosure } from "@/lib/disclosure";
import { Alert, Modal } from "react-daisyui";
import { useBucketContext } from "../context";
import { useConfig } from "@/hooks/useConfig";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { Copy, FileWarningIcon } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

export const shareDialog = createDisclosure<{ key: string; prefix: string }>();

const ShareDialog = () => {
  const { isOpen, data, dialogRef } = shareDialog.use();
  const { bucket, bucketName } = useBucketContext();
  const { data: config } = useConfig();

  // Build share URL:
  //   1. If SHARE_BASE_URL env is set (via config API): path-based URL
  //      e.g. https://files.rennieops.com/<bucket>/<key>
  //   2. If s3_web.root_domain is set: subdomain-based URL
  //      e.g. https://<bucket>.files.rennieops.com/<key>
  //   3. Fallback: bare bucket name (internal)
  const shareBaseUrl = config?.share_base_url;
  const rootDomain = config?.s3_web?.root_domain;

  let url = "";
  if (shareBaseUrl) {
    const base = shareBaseUrl.replace(/\/+$/, "");
    url = base + "/" + bucketName + "/" + (data?.prefix || "") + (data?.key || "");
  } else if (rootDomain) {
    url = "https://" + bucketName + rootDomain + "/" + (data?.prefix || "") + (data?.key || "");
  } else {
    url = "http://" + bucketName + "/" + (data?.prefix || "") + (data?.key || "");
  }

  return (
    <Modal ref={dialogRef} open={isOpen} backdrop>
      <Modal.Header className="truncate">Share {data?.key || ""}</Modal.Header>
      <Modal.Body>
        {!bucket.websiteAccess && (
          <Alert className="mb-4 items-start text-sm">
            <FileWarningIcon className="mt-1" />
            Sharing is only available for buckets with enabled website access.
          </Alert>
        )}
        <div className="relative mt-2">
          <Input
            value={url}
            className="w-full pr-12"
            onFocus={(e) => e.target.select()}
          />
          <Button
            icon={Copy}
            onClick={() => copyToClipboard(url)}
            className="absolute top-0 right-0"
            color="ghost"
          />
        </div>
      </Modal.Body>
      <Modal.Actions>
        <Button onClick={() => shareDialog.close()}>Close</Button>
      </Modal.Actions>
    </Modal>
  );
};

export default ShareDialog;
