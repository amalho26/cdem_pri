// src/pages/DemographicsPage.jsx
import React from "react";

const DemographicsPage = () => {
  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden"
      style={{
        fontFamily: '"Public Sans", "Noto Sans", sans-serif',
      }}
    >
      <div className="layout-container flex h-full grow flex-col">
       

        {/* MAIN CONTENT */}
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#0e141b] text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
                Political Demographics
              </p>
            </div>

            {/* Year Select */}
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#0e141b] text-base font-medium leading-normal pb-2">Year</p>
                <select
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0e141b] focus:outline-0 focus:ring-0 border border-[#d0dbe7] bg-slate-50 focus:border-[#d0dbe7] h-14 placeholder:text-[#4e7397] p-[15px] text-base font-normal leading-normal">
                  <option value="one"></option>
                  <option value="two">two</option>
                  <option value="three">three</option>
                </select>
              </label>
            </div>

            {/* Province Select */}
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#0e141b] text-base font-medium leading-normal pb-2">Province</p>
                <select
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0e141b] focus:outline-0 focus:ring-0 border border-[#d0dbe7] bg-slate-50 focus:border-[#d0dbe7] h-14 placeholder:text-[#4e7397] p-[15px] text-base font-normal leading-normal"
                >
                  <option value="one"></option>
                  <option value="two">two</option>
                  <option value="three">three</option>
                </select>
              </label>
            </div>

            {/* Variable Select */}
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#0e141b] text-base font-medium leading-normal pb-2">
                  Select Variable
                </p>
                <select
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0e141b] focus:outline-0 focus:ring-0 border border-[#d0dbe7] bg-slate-50 focus:border-[#d0dbe7] h-14 placeholder:text-[#4e7397] p-[15px] text-base font-normal leading-normal"
                  >
                  <option value="one"></option>
                  <option value="two">two</option>
                  <option value="three">three</option>
                </select>
              </label>
            </div>

            {/* Statistics */}
            <div className="flex flex-wrap gap-4 p-4">
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-[#e7edf3]">
                <p className="text-[#0e141b] text-base font-medium leading-normal">Average</p>
                <p className="text-[#0e141b] tracking-light text-2xl font-bold leading-tight">65.2%</p>
              </div>
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-[#e7edf3]">
                <p className="text-[#0e141b] text-base font-medium leading-normal">Min</p>
                <p className="text-[#0e141b] tracking-light text-2xl font-bold leading-tight">35.1%</p>
              </div>
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-[#e7edf3]">
                <p className="text-[#0e141b] text-base font-medium leading-normal">Max</p>
                <p className="text-[#0e141b] tracking-light text-2xl font-bold leading-tight">90.7%</p>
              </div>
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-[#e7edf3]">
                <p className="text-[#0e141b] text-base font-medium leading-normal">
                  Standard Deviation
                </p>
                <p className="text-[#0e141b] tracking-light text-2xl font-bold leading-tight">5.3%</p>
              </div>
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-[#e7edf3]">
                <p className="text-[#0e141b] text-base font-medium leading-normal">Median</p>
                <p className="text-[#0e141b] tracking-light text-2xl font-bold leading-tight">66.2%</p>
              </div>
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-[#e7edf3]">
                <p className="text-[#0e141b] text-base font-medium leading-normal">Sum</p>
                <p className="text-[#0e141b] tracking-light text-2xl font-bold leading-tight">
                  4,500,000
                </p>
              </div>
            </div>

            {/* Chart / Visualization */}
            <div className="flex flex-wrap gap-4 px-4 py-6">
              <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-xl border border-[#d0dbe7] p-6">
                <p className="text-[#0e141b] text-base font-medium leading-normal">Voter Turnout</p>
                <div className="grid min-h-[180px] gap-x-4 gap-y-6 grid-cols-[auto_1fr] items-center py-3">
                  <p className="text-[#4e7397] text-[13px] font-bold leading-normal tracking-[0.015em]">
                    Toronto
                  </p>
                  <div className="h-full flex-1">
                    <div
                      className="border-[#4e7397] bg-[#e7edf3] border-r-2 h-full"
                      style={{ width: "60%" }}
                    ></div>
                  </div>

                  <p className="text-[#4e7397] text-[13px] font-bold leading-normal tracking-[0.015em]">
                    Ottawa
                  </p>
                  <div className="h-full flex-1">
                    <div
                      className="border-[#4e7397] bg-[#e7edf3] border-r-2 h-full"
                      style={{ width: "40%" }}
                    ></div>
                  </div>

                  <p className="text-[#4e7397] text-[13px] font-bold leading-normal tracking-[0.015em]">
                    Hamilton
                  </p>
                  <div className="h-full flex-1">
                    <div
                      className="border-[#4e7397] bg-[#e7edf3] border-r-2 h-full"
                      style={{ width: "30%" }}
                    ></div>
                  </div>

                  <p className="text-[#4e7397] text-[13px] font-bold leading-normal tracking-[0.015em]">
                    London
                  </p>
                  <div className="h-full flex-1">
                    <div
                      className="border-[#4e7397] bg-[#e7edf3] border-r-2 h-full"
                      style={{ width: "100%" }}
                    ></div>
                  </div>

                  <p className="text-[#4e7397] text-[13px] font-bold leading-normal tracking-[0.015em]">
                    Kitchener
                  </p>
                  <div className="h-full flex-1">
                    <div
                      className="border-[#4e7397] bg-[#e7edf3] border-r-2 h-full"
                      style={{ width: "100%" }}
                    ></div>
                  </div>

                  <p className="text-[#4e7397] text-[13px] font-bold leading-normal tracking-[0.015em]">
                    Windsor
                  </p>
                  <div className="h-full flex-1">
                    <div
                      className="border-[#4e7397] bg-[#e7edf3] border-r-2 h-full"
                      style={{ width: "90%" }}
                    ></div>
                  </div>

                  <p className="text-[#4e7397] text-[13px] font-bold leading-normal tracking-[0.015em]">
                    Sudbury
                  </p>
                  <div className="h-full flex-1">
                    <div
                      className="border-[#4e7397] bg-[#e7edf3] border-r-2 h-full"
                      style={{ width: "80%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            {/* End Chart / Visualization */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemographicsPage;
