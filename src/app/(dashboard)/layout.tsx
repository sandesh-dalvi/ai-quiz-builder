import Header from "@/components/dashboard/header";
import { QueryProvider } from "@/components/providers/query-provider";
import Sidebar from "@/components/dashboard/sidebar";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <div className=" h-screen flex bg-background">
        <Sidebar />
        <div className=" flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className=" flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </QueryProvider>
  );
}

export default DashboardLayout;
