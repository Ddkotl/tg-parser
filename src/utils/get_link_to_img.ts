export async function getLinkToImg(buffer: Buffer, filename: string = "file.jpg"): Promise<string> {
  const formData = new FormData();
  formData.append("reqtype", "fileupload");
  formData.append("fileToUpload", new Blob([new Uint8Array(buffer)]), filename);

  const response = await fetch("https://catbox.moe/user/api.php", {
    method: "POST",
    body: formData,
  });

  const text = await response.text();

  if (!text.startsWith("https://")) {
    throw new Error("Catbox upload failed: " + text);
  }

  return text; // прямой URL
}
