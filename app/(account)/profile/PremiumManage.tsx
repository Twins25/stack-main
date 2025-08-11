import useUser from "@/hooks/use-user";
import { loadStripe } from "@stripe/stripe-js";
import { cn } from "@/lib/utils";
import { Button } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import { PricingPlans } from "@/app/(paid-plans)/pricing/priceConfig";
import { fontHeading } from "@/config/myFont";
import { LucideCreditCard } from "lucide-react";
import Link from "next/link";
import { Icons } from "@/components/icons/icons";
import { formatDateTimeToFull } from "@/lib/dateUtils";

loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const PremiumManage = () => {
  const { user, active_plan } = useUser();

  const [loading, setLoading] = useState<boolean>(false);
  const [subscriptionEndDate, setSubscriptionEndDate] = useState<Date | null>(
    null
  );
  const email = user?.email;

  const { isPlanActive, activePlan } = useMemo(() => {
    return {
      isPlanActive: active_plan === PricingPlans.PRO,
      activePlan: active_plan,
    };
  }, [active_plan]);

  const fetchSubscriptionDetails = async (user_id: string) => {
    try {
      const paymentCheckResponse = await fetch(
        `/api/users/fetch_subscription?id=${user_id}`,
        {
          method: "GET",
        }
      );

      let paymentCheckResponseData = await paymentCheckResponse.json();
      if (paymentCheckResponseData?.subscription_end) {
        setSubscriptionEndDate(
          new Date(paymentCheckResponseData?.subscription_end)
        );
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (isPlanActive && user?.id) {
      fetchSubscriptionDetails(user?.id);
    }
  }, [isPlanActive, user?.id]);

  const stripePanelLink = `${process.env.NEXT_PUBLIC_STRIPE_MANAGE_SUBSCRIPTION}?prefilled_email=${email}`;

  return (
    <>
      <div className=" w-full flex flex-col p-4 rounded-lg border-gray-200 dark:border-gray-700 relative overflow-hidden ">
        <div className="flex flex-col gap-1">
          <p className=" flex just">Subscription Plan</p>
        </div>
        <p className="text-tiny text-default-500 pt-2 max-w-[100%]">
          Manage your Subscription Plan, Upgrade or Cancel anytime you want.
        </p>
        {isPlanActive ? (
          <div className=" w-full flex flex-col justify-center items-center  mt-10 mb-10 ">
            <Icons.check className="h-16 w-16 text-green-500" />
            <div
              className={cn(
                fontHeading.className,
                "text-2xl py-2 pt-4 ",
                " font-bold -tracking-tight "
              )}
            >
              {activePlan} Subscription Active
            </div>
            {subscriptionEndDate && (
              <div
                className={cn(
                  "my-2 bg-default/40 p-2 px-3 rounded-xl text-center text-sm  -tracking-tight w-[fit-content]  break-words  "
                )}
              >
                Plan Renews on {formatDateTimeToFull(subscriptionEndDate)}
              </div>
            )}
            <div className=" flex flex-col sm:flex-row gap-1 sm:gap-3   ">
              <Button
                className=" mt-3 "
                variant="flat"
                radius="full"
                onClick={() => {
                  setLoading(true);
                  window.location.href = stripePanelLink;
                  setTimeout(() => {
                    setLoading(false);
                  }, 5000);
                }}
                isLoading={loading}
              >
                {!loading ? <LucideCreditCard className=" size-5 " /> : <></>}
                Manage Subscription
              </Button>{" "}
              <Button
                className=" mt-3 "
                variant="flat"
                radius="full"
                onClick={() => {
                  setLoading(true);
                  window.location.href = stripePanelLink;
                  setTimeout(() => {
                    setLoading(false);
                  }, 5000);
                }}
              >
                Cancel Subscription
              </Button>
            </div>
          </div>
        ) : (
          <div className=" w-full flex flex-col justify-center items-center mt-16 mb-10 ">
            <Icons.Cash className="h-16 w-16 mb-2" />
            <div
              className={cn(
                fontHeading.className,
                " text-xl sm:text-2xl py-4 text-center ",
                "font-bold -tracking-tighter"
              )}
            >
              Active Plan: {activePlan}
            </div>
            <Button variant="flat" as={Link} radius="full" href="/pricing">
              Explore Premium Plans
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default PremiumManage;
