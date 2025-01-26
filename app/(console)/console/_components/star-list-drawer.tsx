import { ReactElement, ReactNode } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"


type Props = React.HTMLAttributes<HTMLDivElement> & {
  StarContentComp?: ReactElement | ReactNode
};


export function StarListDrawer({ children, StarContentComp }: Props) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent className="h-[90vh]">
        <div className="mx-auto w-full">
          {StarContentComp}
          <DrawerHeader className="hidden">
            <DrawerTitle></DrawerTitle>
            <DrawerDescription></DrawerDescription>
          </DrawerHeader>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
