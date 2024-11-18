import { useCallback, useRef, useState, DragEvent } from "react";

interface DropBoxProps {
  children: React.ReactNode;
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
}

const DropBox = ({ children, setImages }: DropBoxProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;

    if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;

    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);
      dragCounter.current = 0;

      const files = event.dataTransfer.files
        ? Array.from(event.dataTransfer.files)
        : [];
      if (files && files.length > 0) {
        files.forEach((droppedFile) => {
          if (!droppedFile) {
            alert("how");
            throw new Error("no files dropped");
          }
          if (
            !["image/svg+xml", ".svg"].includes(droppedFile.type) &&
            !["image/svg+xml", ".svg"].some((type) =>
              droppedFile.name.toLowerCase().endsWith(type.replace("*", ""))
            )
          ) {
            alert("Invalid file type. Please upload a supported file type.");
            throw new Error("Invalid file");
          }
        });

        const imageUrls = files.map((file) => URL.createObjectURL(file));
        setImages((prevFiles) => [...prevFiles, ...imageUrls]);
        // setClose(false);
      }
    },
    [setImages]
  );

  return (
    <div
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onDragLeave={handleDragOut}
      onDragEnter={handleDragIn}
      className="w-full h-full flex justify-center items-center"
    >
      {isDragging && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="animate-in fade-in zoom-in relative flex h-[90%] w-[90%] transform items-center justify-center rounded-xl border-2 border-dashed border-white/30 transition-all duration-200 ease-out">
            <p className="text-2xl font-semibold text-white">Drop Files</p>
          </div>
        </div>
      )}
      <div className="flex w-72 flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed">
        <svg
          className="h-8 w-8 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          ></path>
        </svg>
        <p className="text-gray-400 text-sm">Drag and Drop</p>
        <p className="text-gray-400 text-sm">or</p>
        {children}
      </div>
    </div>
  );
};
export default DropBox;
