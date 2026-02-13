import { ORDER_STATUS_COLOR } from "@/utils/constants";
import { dateFormatter } from "@/utils/helper";

const OrderStatusTimeline = ({ history }) => {
  if(history.length === 0){
    return<></>
  }
  return (
    <div className="rounded-xl pt-6">
      <h2 className="text-lg font-bold mb-6">
        Order Status History
      </h2>

      <div className="relative border-l-2 border-gray-200 ml-1">
        {history.map((item) => {
          return (
            <div key={item.id} className="mb-8 relative">
              {/* Content */}
              <div className="bg-gray-50 rounded-lg p-1 shadow-sm">
                <div className="flex justify-between items-center flex-wrap">
                  <p className="text-xs md:text-sm text-gray-800" style={ORDER_STATUS_COLOR[item.status]}>
                    {item.status}
                  </p>

                  <p className="text-sm text-gray-500">
                    {dateFormatter(item.createdAt)}
                  </p>
                </div>
                {item?.meta?.comments && 
                  <p className="text-sm text-gray-600 mt-1">
                    Comments:&nbsp;{item?.meta?.comments}
                  </p>
                }
                {item?.user?.name && 
                  <p className="text-sm text-gray-600 mt-1">
                    {item?.user?.name}
                  </p>
                }
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusTimeline;