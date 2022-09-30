import React from "react";
import "./referral-form.styles.scss";
import {
  Alert,
  Button,
  CircularProgress,
  createTheme,
  FormLabel,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  TextField,
  ThemeProvider,
} from "@mui/material";
import SearchIcon from "@material-ui/icons/Search";
import { Controller, useForm } from "react-hook-form";
import DateAdapter from "@mui/lab/AdapterMoment";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { MobileDatePicker } from "@mui/lab";
import { useNavigate } from "react-router-dom";
import { CirclesWithBar } from "react-loader-spinner";
import UploadComponent from "../../components/UploadComponent";
import moment from "moment";

const ReferralForm = () => {
  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [names, setNames] = React.useState([]);
  const [isValidName, setIsValidName] = React.useState(null);
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm();

  const watchAllFields = watch();

  const onSubmit = (data) => {
    if (data.preApprovalDate) {
      data.preApprovalDateOfExpiry = data.preApprovalDateOfExpiry.format("MM/DD/YYYY");
      data.preApprovalDate = data.preApprovalDate.format("MM/DD/YYYY");
    }
    setSubmitSuccess(false);
    setSubmitting(true);
    const requestOptions = {
      method: "post",
      headers: { "Content-Type": "application/json" },

      body: JSON.stringify(data),
    };
    fetch("https://hook.eu1.make.com/3m4cfkbgi1n8crtwnp91nkstdmpdy9g9", requestOptions).then((res) => {
      if (res.ok) {
        setSubmitting(false);
        setSubmitSuccess(true);
        navigate("/submitSuccess");
      }
    });
  };

  React.useEffect(() => {
    if (!email) return;
    setNames(null);
    fetch(`https://hook.eu1.make.com/h64kh6t2ab1xwrpmfp1mc3wo6hwo3rbp?email=${email}`)
      .then((res) => {
        if (!res.ok) throw "Error";
        setIsValidName(true);
        return res.json();
      })
      .then((res) => {
        setNames(res);
      })
      .catch(() => {
        setIsValidName(false);
        setNames([]);
      });
  }, [email]);

  return (
    <div className="first-form">
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            paddingTop: "10%",
          }}
        >
          <div style={{ width: "50%" }}></div>
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <Paper className="form-background" elevation={9} style={{ background: "white" }}>
            <form className="inner-form" onSubmit={handleSubmit(onSubmit)}>
              {
                <>
                  <div style={{ marginTop: "20px" }}>
                    <FormLabel component="legend">Name &nbsp;</FormLabel>
                    <br />
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      <Controller
                        render={({ field }) => <TextField fullWidth label="First Name*" {...field} />}
                        name="firstName"
                        control={control}
                        rules={{ required: true }}
                      />
                      <Controller
                        render={({ field }) => <TextField fullWidth label="Last Name" {...field} />}
                        name="lastName"
                        control={control}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: "20px" }}>
                    <FormLabel component="legend">Phone &nbsp;</FormLabel>
                    <br />
                    <Controller
                      render={({ field }) => <TextField fullWidth label="Phone*" {...field} />}
                      name="phone"
                      control={control}
                      rules={{ required: true }}
                    />
                  </div>

                  <div style={{ marginTop: "20px" }}>
                    <FormLabel component="legend">Email &nbsp;</FormLabel>
                    <br />
                    <Controller
                      render={({ field }) => <TextField fullWidth label="Email*" {...field} />}
                      name="email"
                      control={control}
                      rules={{ required: true }}
                    />
                  </div>

                  <div style={{ marginTop: "20px" }}>
                    <FormLabel component="legend">Pre-approved?* &nbsp;</FormLabel>
                    <br />
                    <Controller
                      render={({ field }) => (
                        <Select {...field}>
                          <MenuItem value="">-Select-</MenuItem>
                          <MenuItem value="yes">Yes</MenuItem>
                          <MenuItem value="no">No</MenuItem>
                        </Select>
                      )}
                      name="preApproved"
                      control={control}
                      rules={{ required: true }}
                      defaultValue={""}
                    />
                  </div>

                  {getValues("preApproved") === "yes" && (
                    <div>
                      <div style={{ marginTop: "20px" }}>
                        <FormLabel component="legend">Lender &nbsp;</FormLabel>
                        <br />
                        <Controller
                          render={({ field }) => <TextField fullWidth label="Lender*" {...field} />}
                          name="lender"
                          control={control}
                          rules={{ required: true }}
                        />
                      </div>

                      <div style={{ marginTop: "20px" }}>
                        <FormLabel component="legend">Pre-Approval Amount &nbsp;</FormLabel>
                        <br />
                        <Controller
                          render={({ field }) => (
                            <TextField fullWidth label="Pre-Approval Amount*" type="number" {...field} />
                          )}
                          name="preApprovalAmout"
                          rules={{ required: true }}
                          control={control}
                        />
                      </div>

                      <div style={{ marginTop: "20px" }}>
                        <Controller
                          control={control}
                          name="preApprovalDate"
                          render={({ field: { onChange, onBlur, value, ref } }) => (
                            <LocalizationProvider dateAdapter={DateAdapter}>
                              <MobileDatePicker
                                disablePast
                                label="Pre-Approval Date*"
                                value={value}
                                onChange={onChange}
                                selected={value}
                                renderInput={(params) => <TextField fullWidth {...params} />}
                              />
                            </LocalizationProvider>
                          )}
                          defaultValue={moment()}
                          rules={{ required: true }}
                        />
                      </div>

                      <div style={{ marginTop: "20px" }}>
                        <Controller
                          control={control}
                          name="preApprovalDateOfExpiry"
                          render={({ field: { onChange, onBlur, value, ref } }) => (
                            <LocalizationProvider dateAdapter={DateAdapter}>
                              <MobileDatePicker
                                disablePast
                                label="Pre-Approval Date of Expiry"
                                value={value}
                                onChange={onChange}
                                selected={value}
                                renderInput={(params) => <TextField fullWidth {...params} />}
                              />
                            </LocalizationProvider>
                          )}
                          defaultValue={moment()}
                        />
                      </div>

                      <div style={{ marginTop: "20px" }}>
                        <UploadComponent
                          label="Upload Pre-Approval Letter*"
                          setData={(files) => setValue("files", files)}
                          data={getValues("files")}
                        />
                      </div>
                    </div>
                  )}

                  <div style={{ marginTop: "20px" }}>
                    <FormLabel component="legend">Notes &nbsp;</FormLabel>
                    <br />
                    <Controller
                      render={({ field }) => (
                        <TextField
                          fullWidth
                          label="notes"
                          {...field}
                          multiline
                          rows={3}
                          helperText="Please provide any information you feel would be helpful"
                        />
                      )}
                      name="notes"
                      control={control}
                      defaultValue=""
                    />
                  </div>

                  <div style={{ marginTop: "20px" }}>
                    <FormLabel component="legend">Your Email &nbsp;</FormLabel>
                    <br />
                    <Controller
                      render={({ field }) => (
                        <TextField
                          fullWidth
                          label="Your Email*"
                          {...field}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <span onClick={() => setEmail(getValues("yourEmail"))} style={{ cursor: "pointer" }}>
                                  <SearchIcon />
                                </span>
                              </InputAdornment>
                            ),
                          }}
                          helperText="Kindly search for your email and assign your email address. This helps us track the origin of the lead."
                          rules={{ required: true }}
                        />
                      )}
                      name="yourEmail"
                      control={control}
                    />
                  </div>

                  <div className="">
                    <FormLabel component="legend">Your Name &nbsp;</FormLabel>
                    <br />
                    {names ? (
                      <Controller
                        render={({ field }) => (
                          <Select {...field}>
                            {names.map(({ id, Full_Name }) => (
                              <MenuItem value={id} key={`name -  ${id}`}>
                                {Full_Name}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                        name="name"
                        control={control}
                        defaultValue={""}
                      />
                    ) : (
                      <CircularProgress />
                    )}
                  </div>

                  {submitSuccess && <Alert severity="success">Thank you for submitting your lead</Alert>}

                  {Object.keys(errors).length > 0 ||
                    (!getValues("files") && <Alert severity="error">Please enter correct information</Alert>)}

                  {submitting ? (
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <CirclesWithBar
                        height="70"
                        width="70"
                        color="#4fa94d"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                        outerCircleColor=""
                        innerCircleColor=""
                        barColor=""
                        ariaLabel="circles-with-bar-loading"
                      />
                    </div>
                  ) : (
                    <Button
                      variant="contained"
                      disabled={submitting}
                      type="submit"
                      size="large"
                      style={{ background: "#1E3134", color: "white" }}
                      disableElevation
                    >
                      Submit Form
                    </Button>
                  )}
                </>
              }
            </form>
          </Paper>
        </div>
      </div>
    </div>
  );
};

const theme = createTheme({
  palette: {
    primary: {
      main: "#000000",
    },
    secondary: {
      main: "#FFFFFF",
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: [
      '"Montserrat"',
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
});

export default function ReferralFormWrapper() {
  return (
    <ThemeProvider theme={theme}>
      <ReferralForm />
    </ThemeProvider>
  );
}
