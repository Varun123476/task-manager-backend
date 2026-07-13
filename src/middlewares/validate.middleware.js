import asyncHandler from "../utils/asyncHandler.js";

export default function validate(schema) {

    return asyncHandler(async (req, res, next) => {

      const validated = await schema.parseAsync({
                body: req.body,
                params: req.params,
                query: req.query
            });

            req.body = validated.body ?? req.body;
           req.params = validated.params ?? req.params;
          req.validated = validated;
            next();     

    });

}