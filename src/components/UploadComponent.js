import React from "react";
import { Button } from "@mui/material";
import { CloudUpload } from "@material-ui/icons";
import { Form, Upload } from "antd";
import { initializeApp } from "firebase/app";
import { ref, getStorage, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";

initializeApp({
  apiKey: "AIzaSyCv0yRyKzxiSkPoCEnUesSbQsWYBvw1rKk",
  authDomain: "lifestyle-marketing.firebaseapp.com",
  projectId: "lifestyle-marketing",
  storageBucket: "lifestyle-marketing.appspot.com",
  messagingSenderId: "673762043083",
  appId: "1:673762043083:web:bd606b0c82a102cc37e74e",
  measurementId: "G-Z9SJDLYCBL",
});

const FormItem = Form.Item;
const storage = getStorage();

const uploadImage = (onProgress, onError, onSuccess, file, rootFolderName) => {
  let newFile = `${uuidv4()}.${/(?:\.([^.]+))?$/.exec(file.name)[1]}`;
  const storageRef = ref(storage, `${rootFolderName}/` + newFile);

  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    "state_changed",
    (snapshot) => onProgress({ percent: (snapshot.bytesTransferred / snapshot.totalBytes) * 100 }, file),
    (error) => onError(error.code, file),
    () => {
      return getDownloadURL(uploadTask.snapshot.ref).then((res) => onSuccess(res, res));
    }
  );
};

export default Form.create()(
  class extends React.PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        loading: false,
      };
    }
    render() {
      const { form } = this.props;
      const { getFieldDecorator, getFieldValue } = form;
      if (
        getFieldValue("files")?.fileList?.every?.((file) => file.percent === 100 && file.response) &&
        !_.isEqual(
          this.props.data,
          getFieldValue("files").fileList.map((file) => file.response)
        )
      ) {
        console.log(this.props);
        this.props.setData(getFieldValue("files")?.fileList.map((file) => file.response));
      }

      return (
        <Form layout="vertical">
          <FormItem
            label={
              <span
                style={{
                  textAlign: "center",
                  font: "normal normal normal 14px/16px Poppins",
                  letterSpacing: "0.6px",
                }}
              >
                {this.props.label}
              </span>
            }
            required
            style={{ padding: 0, margin: 0 }}
          >
            {getFieldDecorator("files", {
              rules: [
                {
                  required: true,
                  message: "Please upload files",
                },
              ],
              initialValue: null,
            })(
              <Upload
                key="upload"
                multiple={true}
                openFileDialogOnClick
                accept={this.props.accept}
                onRemove={(file) => {}}
                fileList={this.props.form.getFieldValue("files") && this.props.form.getFieldValue("files").fileList}
                customRequest={({ onProgress, onError, onSuccess, data, filename, file }) =>
                  uploadImage(onProgress, onError, onSuccess, file, this.props.folder)
                }
              >
                <Button variant="contained" component="span" color="primary" startIcon={<CloudUpload />}>
                  Upload Files
                </Button>
                <br />
                <br />
              </Upload>
            )}
          </FormItem>
        </Form>
      );
    }
  }
);
