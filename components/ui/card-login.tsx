import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Box } from "@radix-ui/themes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CardLogin() {
  return (
    <Box className="w-[350px] ">
      <a href="/info">
        <Button variant="outline" className="mr-4 mt-2">
          Get Started
        </Button>
      </a>
      <a href="/completions">
        <Button>Playground</Button>
      </a>
    </Box>
  );
}
