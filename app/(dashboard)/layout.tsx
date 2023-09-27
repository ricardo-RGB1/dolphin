import Sidebar from "./_components/sidebar"
import Navbar from "./_components/navbar"

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="h-full">
            {/* Navbar and Sidebar will look the same for ALL pages */}
            <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
                <Navbar />
            </div>
            <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
                <Sidebar />
            </div>
            {/* the content of the app goes here (pushed 56px from the sidebar) */}
            <main className="md:pl-56 pt-[80px] h-full"> 
                {children}
            </main>
        </div>
    )
}

export default DashboardLayout