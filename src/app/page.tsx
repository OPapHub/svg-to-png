"use client";

import Image from "next/image";
import React, { useCallback, useRef, useState } from "react";
import { handleDownload } from "./(tools)/download";
import { DragEvent } from "react";

const MultiFileInput = () => {
  const [images, setImages] = useState<string[]>([]);
  const [close, setClose] = useState<boolean>(true);
  const [scale, setScale] = useState<number>(1);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);
  const SCALE = [1, 2, 4, 8, 16, 32, 64];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScale(1);
    const files = event.target.files ? Array.from(event.target.files) : [];
    const imageUrls = files.map((file) => URL.createObjectURL(file));

    setImages((prevImages) => [...prevImages, ...imageUrls]);
    // setClose(false);
  };

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
    <div className="flex flex-col justify-center items-center min-h-screen gap-y-4">
      <label
        htmlFor="multi-file-input"
        className="block text-sm font-medium text-gray-700"
      >
        Upload multiple files
      </label>
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
          <label className="border rounded-md bg-background px-3 py-2 ring-offset-background cursor-pointer hover:bg-foreground hover:text-background">
            <span>Upload SVG`s</span>
            <input
              type="file"
              id="multi-file-input"
              multiple
              accept=".svg"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>

      {images.length > 0 && (
        <>
          <p className="text-sm font-medium text-gray-500">
            Uploaded images: {images.length}
          </p>
          <button
            onClick={() => {
              setClose((prev) => !prev);
            }}
            className="border rounded-md ring-offset-background px-6 py-2 hover:bg-foreground hover:text-background"
          >
            Show
          </button>
          <div
            className={`${
              close ? "hidden" : "fixed"
            } inset-0 z-50 bg-[#111111] flex items-center justify-center`}
          >
            <div className="h-[calc(100%-20%)] w-[calc(100%-20%)] p-4 pb-0 flex flex-col items-center border rounded-lg">
              {/* {Popup} */}
              <div className="flex justify-between items-center mb-4 w-full">
                <h2 className="text-lg font-bold">Download</h2>
                <button
                  onClick={() => {
                    setClose((prev) => !prev);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✖
                </button>
              </div>
              <div className="flex-1 overflow-y-auto w-full">
                <div className="gap-y-10 gap-x-10 py-5 flex flex-wrap justify-center items-center">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleDownload(index, scale, images)}
                      className="hover:-translate-y-1 hover:scale-105 transition-all"
                    >
                      <Image src={image} width={100} height={100} alt="asda" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-x-4 flex justify-center items-center my-2">
                {SCALE.map((num) => (
                  <button
                    className={`${
                      scale === num ? "text-gray-50" : "text-gray-500"
                    } text-xl p-2`}
                    key={num}
                    onClick={() => setScale(num)}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MultiFileInput;
