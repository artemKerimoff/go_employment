"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Database, FileText } from "lucide-react"
import Link from "next/link"

const documentItems = [
  { label: "Трудовой договор", href: "/contracts", icon: FileText },
  { label: "Приказ об увольнении", href: "/dismissal-orders", icon: FileText },
  { label: "Приказ о принятии", href: "/employment-orders", icon: FileText },
];

const referenceItems = [
  { label: "Счета", href: "/accounts", icon: Database },
  { label: "Организации", href: "/organizations", icon: Database },
  { label: "Отделы", href: "/departments", icon: Database },
  { label: "Должности", href: "/positions", icon: Database },
  { label: "Сотрудники", href: "/individuals", icon: Database },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-zinc-800 bg-zinc-900">
      <SidebarHeader className="border-b border-zinc-800 bg-zinc-900 p-4">
        <h1 className="text-lg font-bold text-zinc-50">Employment System</h1>
        <p className="text-xs text-zinc-500">Управление кадрами</p>
      </SidebarHeader>
      <SidebarContent className="bg-zinc-900 px-0">
        <Accordion type="single" collapsible className="w-full px-2">
          {/* Documents Section */}
          <AccordionItem value="documents" className="border-b border-zinc-800">
            <AccordionTrigger className="py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-zinc-50 data-[state=open]:text-zinc-50">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Документы</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <SidebarMenu className="gap-1">
                {documentItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.href}
                        className="text-zinc-300 hover:text-zinc-50 hover:bg-zinc-800 rounded px-2 py-2"
                      >
                        <item.icon className="w-4 h-4 mr-2" />
                        <span className="text-sm">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </AccordionContent>
          </AccordionItem>

          {/* References Section */}
          <AccordionItem value="references" className="border-b border-zinc-800">
            <AccordionTrigger className="py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-zinc-50 data-[state=open]:text-zinc-50">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                <span>Справочники</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <SidebarMenu className="gap-1">
                {referenceItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.href}
                        className="text-zinc-300 hover:text-zinc-50 hover:bg-zinc-800 rounded px-2 py-2"
                      >
                        <item.icon className="w-4 h-4 mr-2" />
                        <span className="text-sm">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </SidebarContent>
    </Sidebar>
  );
}
