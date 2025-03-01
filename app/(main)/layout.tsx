import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Header";
import { SidebarProvider } from "@/context/SideBarContext";
import { NotificationProvider } from "@/context/NotificationContext";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <Sidebar />
      <main className="ml-0 sm:ml-[238px]">
        <Navbar />
        <div className="p-4 sm:p-8 pt-0 sm:pt-0">
          {" "}
          <NotificationProvider>{children}</NotificationProvider>
        </div>
      </main>
    </SidebarProvider>
  );
}
