import LandingPage from "@/components/LandingPage";
import { getme } from "./actions/auth.actions";

const page = async () => {
  const response = await getme();
  const user = response?.user || null;
  return (
    <>
      <LandingPage user={user} />
    </>
  );
};

export default page;
