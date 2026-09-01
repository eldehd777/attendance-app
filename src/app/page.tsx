import { getAdmins } from "./actions";
import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const initialAdmins = await getAdmins();

  return <HomeClient initialAdmins={initialAdmins} />;
}
