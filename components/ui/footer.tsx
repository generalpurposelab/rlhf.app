import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <div>
      <div className="space-y-1 inset-0 bottom-0 relative pt-6">
        <h4 className="text-sm font-medium leading-none">RLHF Open Feedback</h4>
        <p className="text-sm text-muted-foreground">
          An open-source model evaluation.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  );
}
