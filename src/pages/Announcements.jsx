import {
  Avatar,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import axios from "axios";
import Logo from "../assets/logo.jpg";
import { useEffect, useState } from "react";
import { OpenInNew } from "@material-ui/icons";
import moment from "moment";

function mondayRequest(query) {
  const apiKey =
    "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjEyODIyMzY0NCwidWlkIjoyNTA1NjIwOSwiaWFkIjoiMjAyMS0xMC0xMVQxODo0Nzo1Ni4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6OTk2MTc1OCwicmduIjoidXNlMSJ9.Lo3aJk-3s_XAy-u1vQWY77OvZPtR9BlEFMNefXAh7tI";

  const headers = {
    Authorization: apiKey,
  };

  return axios
    .post("https://api.monday.com/v2", { query }, { headers })
    .then((res) => {
      if (res.data.errors) {
        console.log(res.data);
        throw new Error("Errored out");
      }

      return res.data.data;
    });
}

async function transformData(item) {
  const file = JSON.parse(
    item.column_values.find((c) => c.id === "files")?.value
  )?.files?.[0]?.assetId;

  const { assets } = file
    ? await mondayRequest(`query {
      assets (ids: [${file}]) {
          id
          name
          url
      }
  }`)
    : { assets: [] };
  const date =
    JSON.parse(item.column_values.find((c) => c.id === "date4")?.value)?.date ||
    "";
  const time =
    JSON.parse(item.column_values.find((c) => c.id === "date4")?.value)?.time ||
    "";
  return {
    id: item.id,
    name: item.name,
    description:
      JSON.parse(item.column_values.find((c) => c.id === "long_text")?.value)
        ?.text || "",
    createdAt: `${date ? moment(date).format("MM-DD-YYYY") : ""}${
      time ? "T" : ""
    }${time}`,
    links: [
      ...["link", "dup__of_social_media_url", "dup__of_loom_video_url"].map(
        (column) => ({
          link:
            JSON.parse(item.column_values.find((c) => c.id === column)?.value)
              ?.url || "",
          title: item.column_values.find((c) => c.id === column)?.title,
        })
      ),
      { link: assets?.[0]?.url, title: "PDF" },
    ].filter((link) => link.link),
  };
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState(null);
  useEffect(() => {
    mondayRequest(`
query {
  items_by_column_values (board_id: 2779859876, column_id: "status", column_value: "Active") {
      id
      name
  column_values{
    id
    title
    value
  }
  }
}
`).then((data) => {
      Promise.all(data?.items_by_column_values?.map(transformData)).then(
        (res) => {
          setAnnouncements(
            res?.sort((a, b) => b.createdAt.localeCompare(a.createdAt)) || []
          );
        }
      );
    });
  }, []);

  if (announcements === null) {
    return <CircularProgress />;
  }

  return (
    <>
      <br />
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {announcements.map((item) => (
          <>
            <ListItem alignItems="flex-start" key={item.id}>
              <ListItemAvatar style={{ marginRight: 20 }}>
                <img height={50} src={Logo} />
              </ListItemAvatar>
              <ListItemText
                primary={item.name}
                secondary={
                  <>
                    {item.description}
                    <br />
                    Effective: {item.createdAt}
                    <br />
                    <br />
                    <>
                      {item.links.map((link) => (
                        <Button
                          variant="contained"
                          style={{
                            background: "#1E3134",
                            color: "white",
                            marginRight: 5,
                          }}
                          disableElevation
                          key={link.link}
                          onClick={() => window.open(link.link)}
                        >
                          Open {link.title}
                        </Button>
                      ))}
                    </>
                  </>
                }
              />
            </ListItem>
            {/* <ListItemButton></ListItemButton> */}
            <Divider variant="inset" component="li" />
          </>
        ))}
      </List>
    </>
  );
}
