import { ReactNode } from "react"
import { cn } from "@/lib/utils";
const MaxWidthWrapper = ({className, children}:{className?: String; children:ReactNode}) => {
  return (
    <div className={cn("mx-auto my-2 w-full max-w-screen-xl px-2.5 md:px-20")}>
      {children}
    </div>
  )
}

export default MaxWidthWrapper
