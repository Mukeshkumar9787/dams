"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCallback, useRef, useEffect, useState } from "react";

// Import Swiper styles
import "swiper/css/navigation";
import "swiper/css";
import SingleItem from "./SingleItem";
import { getCategories } from "@/http/apiCalls";
import { STATUS_TYPES } from "@/utils/constants";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

const Categories = () => {
  const [data, setData] = useState([]);
  const sliderRef = useRef(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = new URLSearchParams(searchParams.toString());

  const setCategoryFilter = (category: string) => {
    params.set('category', category.toString());
    router.push(`/shop?${params.toString()}`);
  };

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.swiper.init();
    }
  }, []);

  useEffect(() => {
      const fetchCategories = async () => {
        try {
          const data = await getCategories({status: STATUS_TYPES.ACTIVE});
          setData(data?.data || []);
        } catch (err) {
          console.error(err);
        }
      };
  
      fetchCategories();
  }, []);

  return (
    <section className="overflow-hidden bg-transparent pb-14 pt-10 sm:pt-12 lg:pt-16">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="px-1 py-2 sm:px-0">
          {/* <!-- section title --> */}
          <div className="mb-8 flex flex-col gap-5 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[620px]">
              <span className="mb-2 inline-flex items-center gap-2.5 rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-sm font-medium text-sky-700 shadow-sm">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_834_7356)">
                    <path
                      d="M3.94024 13.4474C2.6523 12.1595 2.00832 11.5155 1.7687 10.68C1.52908 9.84449 1.73387 8.9571 2.14343 7.18231L2.37962 6.15883C2.72419 4.66569 2.89648 3.91912 3.40771 3.40789C3.91894 2.89666 4.66551 2.72437 6.15865 2.3798L7.18213 2.14361C8.95692 1.73405 9.84431 1.52927 10.6798 1.76889C11.5153 2.00851 12.1593 2.65248 13.4472 3.94042L14.9719 5.46512C17.2128 7.70594 18.3332 8.82635 18.3332 10.2186C18.3332 11.6109 17.2128 12.7313 14.9719 14.9721C12.7311 17.2129 11.6107 18.3334 10.2184 18.3334C8.82617 18.3334 7.70576 17.2129 5.46494 14.9721L3.94024 13.4474Z"
                      stroke="#3C50E0"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="7.17245"
                      cy="7.39917"
                      r="1.66667"
                      transform="rotate(-45 7.17245 7.39917)"
                      stroke="#3C50E0"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M9.61837 15.4164L15.4342 9.6004"
                      stroke="#3C50E0"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_834_7356">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                Categories
              </span>
              <h2 className="font-semibold text-2xl tracking-tight text-dark sm:text-3xl xl:text-heading-4">
                Browse by Category
              </h2>
              <p className="mt-3 max-w-[520px] text-sm leading-6 text-dark-4 sm:text-base">
                Move through the catalog by collection first, then narrow into the products that match your space, finish, and mood.
              </p>
            </div>

            <div className="ml-auto flex items-center gap-3 self-end lg:self-auto">
              <button
                onClick={handlePrev}
                className="!static !mt-0 flex items-center justify-center rounded-full border border-slate-200 bg-white text-sky-700 shadow-sm transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                style={{ width: 32, height: 32, minWidth: 32 }}
              >
                <svg
                  className="fill-current"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.4881 4.43057C15.8026 4.70014 15.839 5.17361 15.5694 5.48811L9.98781 12L15.5694 18.5119C15.839 18.8264 15.8026 19.2999 15.4881 19.5695C15.1736 19.839 14.7001 19.8026 14.4306 19.4881L8.43056 12.4881C8.18981 12.2072 8.18981 11.7928 8.43056 11.5119L14.4306 4.51192C14.7001 4.19743 15.1736 4.161 15.4881 4.43057Z"
                    fill=""
                  />
                </svg>
              </button>

              <button
                onClick={handleNext}
                className="!static !mt-0 flex items-center justify-center rounded-full border border-slate-200 bg-white text-sky-700 shadow-sm transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                style={{ width: 32, height: 32, minWidth: 32 }}
              >
                <svg
                  className="fill-current"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.51192 4.43057C8.82641 4.161 9.29989 4.19743 9.56946 4.51192L15.5695 11.5119C15.8102 11.7928 15.8102 12.2072 15.5695 12.4881L9.56946 19.4881C9.29989 19.8026 8.82641 19.839 8.51192 19.5695C8.19743 19.2999 8.161 18.8264 8.43057 18.5119L14.0122 12L8.43057 5.48811C8.161 5.17361 8.19743 4.70014 8.51192 4.43057Z"
                    fill=""
                  />
                </svg>
              </button>
            </div>
          </div>

          <Swiper
            ref={sliderRef}
            slidesPerView={6}
            spaceBetween={18}
            breakpoints={{
              // when window width is >= 640px
              0: {
                slidesPerView: 2,
                spaceBetween: 14,
              },
              1000: {
                slidesPerView: 4,
                spaceBetween: 18,
              },
              // when window width is >= 768px
              1200: {
                slidesPerView: 6,
                spaceBetween: 18,
              },
            }}
          >
            {data.map((item, key) => (
              <SwiperSlide key={key}>
                <SingleItem item={item} onClick={()=>{setCategoryFilter(item.slug)}} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Categories;
