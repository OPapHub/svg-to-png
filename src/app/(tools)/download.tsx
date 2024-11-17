export const handleDownload = (
  index: number,
  scale: number,
  images: string[]
) => {
  const svgUrl = images[index];

  const filename =
    svgUrl.split("/").pop()?.split(".")[0] || `image_${index + 1}`;

  // Create an image element to load the SVG
  const img = new Image() as HTMLImageElement;
  img.src = svgUrl;

  // Wait for the SVG to be loaded and then render it to the canvas
  img.onload = () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (context) {
      // Set canvas dimensions to match the image
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      // Draw the SVG image onto the canvas
      context.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Convert the canvas content to a PNG data URL
      const pngUrl = canvas.toDataURL("image/png");

      // Create a link to trigger the download
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = `${filename}.png`; // Name the file dynamically
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
};
