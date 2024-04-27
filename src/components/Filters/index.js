import React from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

//antd imports
import { Badge, Button, Checkbox, DatePicker, Popover } from "antd";
import { FilterFilled } from "@ant-design/icons";

//helper functions imports
import {
  FilterSvg,
  Priority_Options,
  Sort_Options,
  Task_Status,
} from "../../helpers/constants";

//css imports
import "./Filters.scss";

const Filters = ({
  searchQuery,
  filterPopoverOpen,
  setFilterPopoverOpen,
  appliedFilters,
  sortPopoverOpen,
  setSortPopoverOpen,
  setSortValue,
  filterData,
  changeFilters,
  returnFiltersCount,
  disabled,
  applyFilters,
  clearFilters,
}) => {
  const { mobile } = useSelector((state) => state?.config);
  return (
    <div className="filter_sort_div">
      <Popover
        content={
          <>
            {Sort_Options?.map((item) => {
              return (
                <div
                  key={item?.value}
                  className="sort_options"
                  role="button"
                  onClick={() => {
                    setSortValue(item?.value);
                    setSortPopoverOpen(!sortPopoverOpen);
                    filterData(searchQuery, item?.value, appliedFilters);
                  }}
                >
                  {item?.label}
                </div>
              );
            })}
          </>
        }
        placement="bottom"
        trigger="click"
        open={sortPopoverOpen}
        onOpenChange={() => setSortPopoverOpen(!sortPopoverOpen)}
      >
        <Button
          className="sort_button"
          disabled={disabled}
          size={mobile ? "small" : ""}
          aria-haspopup="true"
        >
          <FilterSvg
            disabled={disabled}
            width={mobile ? 14 : 18}
            height={mobile ? 14 : 18}
          />
          Sort By
        </Button>
      </Popover>
      <Badge
        count={!filterPopoverOpen ? returnFiltersCount(appliedFilters) : 0}
        size="small"
        aria-label="Filter Badge"
      >
        <Popover
          content={
            <>
              <div className="filter_body">
                <div className="filter_heading">Task Priority</div>
                <Checkbox.Group
                  options={Priority_Options}
                  onChange={(val) => changeFilters("priority", val)}
                  className="checkbox_content"
                />
              </div>
              <div className="filter_body">
                <div className="filter_heading">Task Status</div>
                <Checkbox.Group
                  options={Task_Status}
                  onChange={(val) => changeFilters("status", val)}
                  className="checkbox_content"
                />
              </div>
              <div className="filter_body">
                <div className="filter_heading">Due Date</div>
                <div className="dates_div">
                  <DatePicker
                    style={{ width: "45%" }}
                    onChange={(_, val) => changeFilters("start_date", val)}
                    value={
                      appliedFilters?.date?.[0]
                        ? dayjs(appliedFilters?.date?.[0])
                        : null
                    }
                    placeholder="Select Start Date"
                  />
                  <DatePicker
                    style={{ width: "45%" }}
                    onChange={(e, val) => changeFilters("end_date", val)}
                    value={
                      appliedFilters?.date?.[1]
                        ? dayjs(appliedFilters?.date?.[1])
                        : null
                    }
                    disabledDate={(current) =>
                      current &&
                      current <
                        dayjs(
                          dayjs(appliedFilters?.date?.[0]).format("YYYY-MM-DD")
                        )
                    }
                    disabled={!appliedFilters?.date?.[0]?.length}
                    placeholder="Select End Date"
                  />
                </div>
              </div>
              <div className="filter_actions">
                <Button size="small" onClick={() => clearFilters()}>
                  Clear Filters
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Button
                  size="small"
                  type="primary"
                  onClick={() => applyFilters()}
                >
                  Apply Filters
                </Button>
              </div>
            </>
          }
          placement="leftTop"
          trigger="click"
          open={filterPopoverOpen}
          onOpenChange={() => setFilterPopoverOpen(!filterPopoverOpen)}
        >
          <FilterFilled
            role="button"
            aria-haspopup="true"
            className={`filters_badge ${disabled ? "disabled_class" : ""}`}
          />
        </Popover>
      </Badge>
    </div>
  );
};
export default Filters;
