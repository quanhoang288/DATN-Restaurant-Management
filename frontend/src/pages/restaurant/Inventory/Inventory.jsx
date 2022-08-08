import React, { useState } from "react";
import { Typography } from "@material-ui/core";

import CustomTabs from "../../../components/CustomTabs/CustomTabs";
import Main from "../../../containers/Main/Main";
import TabPanel from "../../../components/CustomTabs/TabPanel";
import InventoryList from "./InventoryList";
import InventoryHistoryList from "./InventoryHistoryList";

function Inventory(props) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Main>
      <div>
        {/* <div className='list__header'>
          <Typography variant='h5'>Cơ sở vật chất</Typography>
        </div> */}
        <CustomTabs
          labels={["Thông tin kho", "Lịch sử nhập kho"]}
          activeTab={activeTab}
          onChangeActiveTab={(val) => setActiveTab(val)}
        >
          <TabPanel value={activeTab} index={0}>
            <InventoryList />
          </TabPanel>
          <TabPanel value={activeTab} index={1}>
            <InventoryHistoryList />
          </TabPanel>
        </CustomTabs>
      </div>
    </Main>
  );
}

export default Inventory;
