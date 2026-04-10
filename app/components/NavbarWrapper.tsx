import { getCurrentUser } from "@/lib/auth";
import Navbar from "./Navbar";

export default async function NavbarWrapper(props: {
  hidden?: boolean;
  sticky?: boolean;
  showSearchOnScroll?: boolean;
}) {
  const user = await getCurrentUser();
  return <Navbar {...props} user={user} />;
}
