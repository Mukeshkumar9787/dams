import { redirect } from "next/navigation";
import { CONFIG_COMPANY_URL } from "@/utils/appUrls";

const ConfigPage = () => {
  redirect(CONFIG_COMPANY_URL);
};

export default ConfigPage;
