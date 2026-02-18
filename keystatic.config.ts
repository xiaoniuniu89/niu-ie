import { config, fields, collection } from "@keystatic/core";

export default config({
  storage: {
    kind: "local",
  },
  collections: {
    posts: collection({
      label: "Posts",
      slugField: "title",
      path: "content/posts/*",
      format: { contentField: "content" },
      entryLayout: "content",
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        date: fields.date({ label: "Date", validation: { isRequired: true } }),
        categories: fields.multiselect({
          label: "Categories",
          options: [
            { label: "Music", value: "music" },
            { label: "Games", value: "games" },
            { label: "Software", value: "software" },
          ],
        }),
        description: fields.text({
          label: "Description",
          description: "Short description for listing cards",
          validation: { isRequired: true },
        }),
        published: fields.checkbox({
          label: "Published",
          defaultValue: true,
        }),
        content: fields.mdx({
          label: "Content",
        }),
      },
    }),
  },
});
