import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router-dom";
import Showcase from "@/components/showcase.tsx";

export default function Home() {
  return (
    <div>
      <div className="max-w-6xl m-auto flex gap-8 py-12">
        <div className="flex flex-col gap-12 flex-1 justify-center">
          <div>
            <h1 className="text-5xl font-bold">Welcome to Taskflow</h1>
            <p className="text-2xl text-muted-foreground mt-2">
              A simple, performant and intuitive app for your project and for
              your team.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild size="lg" className="text-lg h-12">
              <Link to="/sign-in">Get started</Link>
            </Button>
          </div>
        </div>
        <div className="aspect-square flex-1 grid place-items-center">
          <Showcase />
        </div>
      </div>
    </div>
  );
}
