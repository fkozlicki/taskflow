import { Button } from "@/components/ui/button.tsx";
import { icons } from "@/components/icons.tsx";

export default function OAuthLinks() {
  return (
    <div className="flex gap-4">
      <Button className="flex-1" variant="outline" size="lg" asChild>
        <a href="http://localhost:8080/oauth2/authorization/google">
          <icons.Google className="size-4 mr-2" />
          Google
        </a>
      </Button>
      <Button className="flex-1" variant="outline" size="lg" asChild>
        <a href="http://localhost:8080/oauth2/authorization/google">
          <icons.Github className="size-4 mr-2" />
          Github
        </a>
      </Button>
    </div>
  );
}
