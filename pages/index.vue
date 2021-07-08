<template>
  <div class="pa-4">
    <v-calendar
      color="primary"
      type="week"
      :now="now"
      :value="now"
      :events="calendarEvents"
    />
  </div>
</template>

<script>
export default {
  data: () => ({
    now: '2021-08-01',
    courses: [
      {
        name: 'Example Course 1',
        days: [
          {
            number: 1,
            start: { hours: 12, minutes: 30 },
            end: { hours: 15, minutes: 0 },
          },
          {
            number: 3,
            start: { hours: 12, minutes: 30 },
            end: { hours: 15, minutes: 0 },
          },
        ],
      },
      {
        name: 'Example Course 2',
        days: [
          {
            number: 2,
            start: { hours: 12, minutes: 30 },
            end: { hours: 15, minutes: 0 },
          },
          {
            number: 4,
            start: { hours: 12, minutes: 30 },
            end: { hours: 15, minutes: 0 },
          },
        ],
      },
    ],
  }),
  computed: {
    calendarEvents() {
      return this.courses.reduce((events, course) => {
        course.days.forEach((day) => {
          events.push({
            name: course.name,
            start: `2021-08-0${day.number + 1} ${day.start.hours}:${day.start.minutes}`,
            end: `2021-08-0${day.number + 1} ${day.end.hours}:${day.end.minutes}`,
          })
        })
        return events
      }, [])
    },
    routeQuery() {
      return this.courses.reduce((query, course, index) => {
        const days = course.days.reduce((query, day, index) => {
          return query + (index > 0 ? '|' : '') + this.courseDayToQuery(day)
        }, '')
        query[index] = `${course.name}|${days}`
        return query
      }, {})
    },
  },
  watch: {
    routeQuery() {
      if (JSON.stringify(this.$route.query) === JSON.stringify(this.routeQuery)) { return }
      this.$router.replace({ path: '/', query: this.routeQuery })
    },
  },
  created() {
    this.courses = Object.values(this.$route.query).reduce((courses, courseQuery) => {
      const [name, ...days] = courseQuery.split('|')
      courses.push({
        name,
        days: days.reduce((courseDays, queryDay) => {
          const [number, startHours, startMinutes, endHours, endMinutes] = queryDay.split(',')
          courseDays.push({
            number: parseInt(number),
            start: { hours: parseInt(startHours), minutes: parseInt(startMinutes) },
            end: { hours: parseInt(endHours), minutes: parseInt(endMinutes) },
          })
          return courseDays
        }, []),
      })
      return courses
    }, [])
  },
  methods: {
    courseDayToQuery(day) {
      return `${day.number},${day.start.hours},${day.start.minutes},${day.end.hours},${day.end.minutes}`
    },
  },
}
</script>
