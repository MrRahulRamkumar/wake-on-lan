import { wake } from "./util/wake-on-lan.js";
import { serve } from "bun";

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

  // Enable development mode for:
  // - Detailed error messages
  // - Hot reloading (Bun v1.2.3+ required)
  development: true,
});

console.log(`Listening on ${server.url}`);
