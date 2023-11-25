'use client'
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "../_trpc/client";
import { Loader2 } from "lucide-react";
export default function page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");
  const { data, isLoading } = trpc.authCallback.useQuery(undefined, {
    onSuccess: (success) => {
      if (success) router.push(origin ? `/${origin}` : "/dashboard");
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        router.push("/sign-in");
        console.log(error);
      }
    
    },
    retry: true,
    retryDelay: 1000,
   
  });

  return (<div className="w-full mt-20 flex justify-center">
    <div className="flex flex-col items-center gap-2">
      <Loader2 className="h-8 w-8 animate-spin text-zinc-700">
        <h3 className="font-semibold text-xl">
          Setting up...
        </h3>
        <p>
          You will be redirected shortly...
        </p>
      </Loader2>
    </div>

  </div>)
}
