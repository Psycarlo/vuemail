/** The components of a category of the gallery, with their code and HTML. */
export default defineEventHandler(async (event) => {
  const category = findCategory(getRouterParam(event, 'category') ?? '');
  if (!category) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Component category not found',
    });
  }

  return {
    category,
    components: await Promise.all(
      category.components.map((component) => getImportedComponent(component)),
    ),
  };
});
