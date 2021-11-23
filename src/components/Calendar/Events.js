//holds the events that are stored

export default
    [
      {
       id: 0,
        title: "Today",
        start: new Date(new Date().setHours(new Date().getHours() - 3)),
        end: new Date(new Date().setHours(new Date().getHours() + 3))
      },
      {
       id: 1,
        title: "Yesterday",
        start: new Date(new Date().setHours(new Date().getHours() - 27)),
        end: new Date(new Date().setHours(new Date().getHours() - 21))
      }
    ]
