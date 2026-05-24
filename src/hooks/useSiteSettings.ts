import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SiteSettings {
  whatsapp: string;
  facebook: string;
  email: string;
  facebook_page: string;
}

const defaults: SiteSettings = {
  whatsapp: "+8801401459739",
  facebook: "https://www.facebook.com/ZyraElin",
  email: "contact@zyraelin.com",
  facebook_page: "Zyra Elin Studio",
};

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site_settings"],
    queryFn: async (): Promise<SiteSettings> => {
      const { data } = await supabase.from("site_settings").select("key,value");
      const out: SiteSettings = { ...defaults };
      data?.forEach((row) => { (out as Record<string, string>)[row.key] = row.value; });
      return out;
    },
    staleTime: 60_000,
  });
}

export function waLink(phone: string) {
  return `https://wa.me/${phone.replace(/[^0-9]/g, "")}`;
}
