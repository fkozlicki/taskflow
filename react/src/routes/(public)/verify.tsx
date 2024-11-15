import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useVerify } from "@/hooks/mutations/use-verify.ts";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { LoaderIcon } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";

export default function Verify() {
  const [params] = useSearchParams();
  const code = params.get("code");

  const { mutate, isPending, isSuccess, isError } = useVerify();

  useEffect(() => {
    if (code) {
      mutate(code);
    }
  }, []);

  if (!code) {
    return <Navigate to="/" />;
  }

  return (
    <div className="h-screen w-screen grid place-items-center">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle>
            {isPending && "We are verifying your email"}
            {isError && "Couldn't verify your email"}
            {isPending && "Email verified"}
          </CardTitle>
          <CardDescription>
            {isSuccess && "You are good to go"}
            {isError && "Please try again"}
            {isPending && "Thank you for your patience"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isPending ? (
            <LoaderIcon className="size-12 animate-spin mx-auto" />
          ) : (
            <div className="flex gap-4">
              <Button className="flex-1" variant="outline" asChild>
                <Link to="/">Home</Link>
              </Button>
              <Button className="flex-1" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
