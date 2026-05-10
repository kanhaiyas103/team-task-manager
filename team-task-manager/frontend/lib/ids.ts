export const getEntityId = (entity: { id?: string; _id?: string }): string => {
  return entity.id || entity._id || "";
};
