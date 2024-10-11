import * as HttpStatusPhrases from "@/constants/http-status-phrases";
import createMessageObjectSchema from "@/middlewares/openapi/create-message-object-schema";

export const notFoundSchema = createMessageObjectSchema(HttpStatusPhrases.NOT_FOUND);
