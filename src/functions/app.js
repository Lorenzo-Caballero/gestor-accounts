import express from "express";
import usersRoutes from "../routes/users.routes.js";
import designsRoutes from "../routes/designs.routes.js";
import cors from "cors";
import bodyParser from 'body-parser';

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use("/api", usersRoutes);
app.use("/api", designsRoutes);


app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.status(404).json({
        message: "faunotattoo: endpoint no encontrado:( Revisa la URL"
    });
});

export default app;
