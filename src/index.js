import { wake } from "./util/wake-on-lan.js";
import { serve } from "bun";

if (!Bun.env.MAC_ADDRESS) {
  throw new Error("MAC_ADDRESS is not set");
}

const server = serve({
  routes: {
    // ** API endpoints ** (Bun v1.2.3+ required)
    "/": {
      async GET(req) {
        return new Promise((resolve, reject) => {
          wake(Bun.env.MAC_ADDRESS, function (error) {
            if (error) {
              console.error(error);
              resolve(
                Response.json(
                  {
                    success: false,
                    message: "Error sending wake-on-lan packet",
                  },
                  { status: 500 }
                )
              );
            } else {
              resolve(
                Response.json({
                  success: true,
                  message: "Wake-on-lan packet sent",
                })
              );
            }
          });
        });
      },
    },
  },
  port: 2000,
});

console.log(`Listening on ${server.url}`);
