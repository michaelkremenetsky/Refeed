import Image from "next/image";
import Link from "next/link";

export const MobileCard = () => {
  return (
    <div className="mx-4 flex justify-center px-1.5 md:mx-auto md:w-full">
      <div className="h-[400px] w-[400px] overflow-hidden rounded-xl border bg-[#FAFBFC] lg:w-[825px] xl:w-[1248px]">
        <div className="flex flex-col gap-x-32 pt-10 sm:items-center sm:pt-0 md:flex-row">
          <div className="flex max-w-[600px] flex-col sm:-translate-y-8 sm:pl-16 md:w-1/2">
            <div className="flex flex-col ">
              <div className="flex flex-col gap-y-4">
                <div className="flex items-center justify-center sm:justify-start">
                  <h3 className="text-2xl font-[650] sm:text-left sm:text-3xl">
                    Refeed Mobile App
                  </h3>
                  <span className="ml-2.5 h-5 translate-y-[1px] rounded bg-[#0496FF]/10 px-[6px] text-right text-sm font-[450] text-sky-500">
                    Alpha
                  </span>
                </div>
                <span className="mx-4 text-center text-lg text-neutral-500/90  sm:mx-0 sm:text-left">
                  Want to access your Feeds on the go? Download the Refeed
                  Mobile App for iOS and Android apps.
                </span>
              </div>
            </div>
            <Link href="/mobile" className="mx-auto w-fit md:mx-0">
              <button className="mx-auto mt-6 w-[230px] rounded-md bg-white px-6 py-1.5 text-[17px] font-[450] shadow-[0_0_0_1px_rgba(18,55,105,0.08),0_1px_2px_0_rgba(18,55,105,0.12)] sm:mx-0">
                Sign Up for Waitlist
              </button>
            </Link>
          </div>
          <div className="flex max-w-[1000px] items-center justify-center overflow-hidden rounded-lg sm:w-2/5">
            <Image
              src="/Mobile.png"
              alt="Mobile App"
              width="1300"
              height="1228"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};
