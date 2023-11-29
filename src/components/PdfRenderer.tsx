"use client";
import React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { ChevronDown, Loader2, ChevronUp, Expand } from "lucide-react";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
import { useToast } from "./ui/use-toast";
import { Button } from "./ui/button";
import { useResizeDetector } from "react-resize-detector";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import cn from "classnames";
import { RotateCw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
} from "@radix-ui/react-dropdown-menu";
import PdfFullscreen from "./FullscreenPdf";
import { Dialog } from "./ui/dialog";
import { Search } from "lucide-react";
type pdfRendererProps = {
  url: string;
};

import SimpleBar from "simplebar-react";
import { DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
export default function PdfRenderer({ url }: pdfRendererProps) {
  const [isFullscreen, setIsFullscreen] = React.useState<boolean>(false);
  const { toast } = useToast();
  const { width, ref } = useResizeDetector();
  const [numPages, setNumPages] = React.useState<number>();
  const [currPage, setCurrPage] = React.useState<number>(1);
  const [scale, setScale] = React.useState<number>(1);
  const [rotation, setRotation] = React.useState<number>(0);
  const CustomPageValidator = z.object({
    page: z
      .string()
      .refine((val) => Number(val) <= numPages! && Number(val) > 0),
  });
  type CustomPageValidatorType = z.infer<typeof CustomPageValidator>;
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CustomPageValidatorType>({
    defaultValues: {
      page: "1",
    },
    resolver: zodResolver(CustomPageValidator),
  });
  const handlePageSubmit = ({ page }: CustomPageValidatorType) => {
    setCurrPage(Number(page));
    setValue("page", String(currPage));
  };

  return (
    <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
      <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5">
          <Button
            disabled={currPage <= 1}
            aria-label="previous page"
            variant="ghost"
            onClick={() => {
              if (currPage > 1) {
                setCurrPage(currPage - 1);
              }
              setValue("page", String(currPage - 1));
            }}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <div
            className={cn(
              "flex items-center gap-1.5",
              errors.page && "focus-visible:ring-red-600"
            )}
          >
            <Input
              {...register("page")}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(handlePageSubmit)();
                }
              }}
              className="w-12 h-8"
            />
            <p className="text-zinc-500 text-sm space-x-1">
              <span>/{numPages !== undefined ? String(numPages) : "x"}</span>
            </p>
          </div>
          <Button
            disabled={numPages === undefined || currPage === numPages}
            aria-label="next page"
            variant="ghost"
            onClick={() => {
              setCurrPage((prev) =>
                prev + 1 > numPages! ? numPages! : prev + 1
              );
              setValue("page", String(currPage + 1));
            }}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-x-2 ">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label="zoom" variant="ghost">
                <Search className="h-4 w-4" />
                {scale * 100}% <ChevronDown className="h-4 w-4 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-50">
              <DropdownMenuItem onSelect={() => setScale(1)}>
                100%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(1.5)}>
                150%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2)}>
                200%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2.5)}>
                250%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            aria-label="rotate-90 deg"
            onClick={() => setRotation((prev) => prev + 90)}
          >
            <RotateCw className="h-4 w-4"></RotateCw>
          </Button>
          <PdfFullscreen fileUrl={url} />
        </div>
      </div>

      <div className="flex-1 w-full max-h-screen">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)]">
          <div ref={ref}>
            <Document
              file={url}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              className="max-h-full "
              loading={
                <div className="flex items-center justify-center ">
                  <Loader2 className="my-20 h-6 w-6 animate-spin" />
                </div>
              }
              onLoadError={() => {
                toast({
                  title: "Error in loading PDF",
                  description: "Please try again",
                  variant: "destructive",
                });
              }}
            >
              <Page
                width={width ? width : 1}
                pageNumber={currPage}
                scale={scale}
                rotate={rotation}
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
}
