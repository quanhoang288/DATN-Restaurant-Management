import React, { useEffect, useState } from "react";
import {
  List,
  MenuItem,
  ListItemText,
  Box,
  TextField,
  Button,
} from "@material-ui/core";
import "./Setting.css";
import Main from "../../../containers/Main/Main";
import CustomTabs from "../../../components/CustomTabs/CustomTabs";
import TabPanel from "../../../components/CustomTabs/TabPanel";
import { getSettings, saveSettings } from "../../../apis/setting";
import Toast from "../../../components/Toast/Toast";

function Setting() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [isSaveSuccessful, setSaveSuccessful] = useState(false);

  const [setting, setSetting] = useState({
    name: null,
    vat: null,
  });

  const fetchSettings = async () => {
    const settings = (await getSettings()).data;
    setSetting(
      (settings || []).reduce(
        (res, set) => ({ ...res, [set.name]: set.value }),
        {}
      )
    );
  };

  const handleSaveSetting = async (settings = {}) => {
    const payload = [];
    for (const [key, val] of Object.entries(settings)) {
      payload.push({ name: key, value: val });
    }
    const res = await saveSettings({ settings: payload });
    if (res) {
      setSaveSuccessful(true);
    }
  };

  useEffect(() => {
    console.log("setting: ", setting);
  }, [setting]);

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <Main>
      {isSaveSuccessful && (
        <Toast
          message='Cập nhật thông tin cài đặt thành công'
          variant='success'
          handleClose={() => setSaveSuccessful(false)}
        />
      )}
      <div className='edit__background'>
        <div className='edit__profile__container'>
          <div className='edit__options__container'>
            <List>
              {["Thông tin chung", "Phân quyền"].map((text, index) => (
                <MenuItem
                  button
                  key={text}
                  className='sidebar__item'
                  selected={selectedIndex === index}
                >
                  <ListItemText
                    primary={text}
                    onClick={() => setSelectedIndex(index)}
                  />
                </MenuItem>
              ))}
            </List>
          </div>
          <div className='main__content'>
            {selectedIndex === 0 ? (
              <>
                <div className='edit__info__form'>
                  <Box component='form' noValidate>
                    <TextField
                      margin='normal'
                      fullWidth
                      id='name'
                      label='Tên nhà hàng'
                      name='name'
                      InputLabelProps={{
                        shrink: true,
                        style: {
                          fontSize: 20,
                        },
                      }}
                      value={setting.name}
                      onChange={(e) =>
                        setSetting({ ...setting, name: e.target.value || null })
                      }
                    />
                    <TextField
                      margin='normal'
                      fullWidth
                      label='Thuế VAT (%)'
                      type='number'
                      InputLabelProps={{
                        shrink: true,
                        style: {
                          fontSize: 20,
                        },
                      }}
                      value={setting.vat}
                      onChange={(e) =>
                        setSetting({
                          ...setting,
                          vat: e.target.value || null,
                        })
                      }
                    />

                    <div className='submit__btn__container'>
                      <Button
                        variant='contained'
                        color='primary'
                        onClick={() => handleSaveSetting(setting)}
                      >
                        Lưu
                      </Button>
                    </div>
                  </Box>
                </div>
              </>
            ) : (
              <div className='edit__password__form'>
                <CustomTabs
                  labels={["Quyền truy cập", "Chức danh"]}
                  activeTab={activeTab}
                  onChangeActiveTab={(val) => setActiveTab(val)}
                >
                  <TabPanel value={activeTab} index={0}>
                    <div>Permission</div>
                  </TabPanel>
                  <TabPanel value={activeTab} index={1}>
                    <div>Role</div>
                  </TabPanel>
                </CustomTabs>
              </div>
            )}
          </div>
        </div>
      </div>
    </Main>
  );
}

export default Setting;
