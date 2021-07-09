<template>
  <div class="pa-4">
    <v-expansion-panels class="mb-4">
      <v-expansion-panel>
        <v-expansion-panel-header>Add Course</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-form
            ref="addCourseForm"
            v-model="addCourseIsValid"
            @submit.prevent
          >
            <v-row
              no-gutters
              class="ma-n2"
            >
              <v-col
                cols="12"
                md="6"
                class="px-2"
              >
                <v-text-field
                  v-model="addCourseName"
                  label="Name"
                  outlined
                  dense
                  :rules="courseNameRules"
                />
              </v-col>
              <v-col
                cols="12"
                md="6"
                class="px-2"
              >
                <v-text-field
                  v-model="addCourseColor"
                  label="Color"
                  outlined
                  dense
                  :rules="courseColorRules"
                />
              </v-col>
              <v-col
                cols="12"
                md="4"
                class="px-2"
              >
                <DayField
                  ref="addCourseDayField"
                  v-model.number="addCourseDayNumber"
                />
              </v-col>
              <v-col
                cols="12"
                md="4"
                class="px-2"
              >
                <TimeField
                  ref="addCourseDayStartField"
                  v-model="addCourseDayStart"
                  label="Start Time"
                />
              </v-col>
              <v-col
                cols="12"
                md="4"
                class="px-2"
              >
                <TimeField
                  ref="addCourseDayEndField"
                  v-model="addCourseDayEnd"
                  label="End Time"
                />
              </v-col>
            </v-row>
            <div class="text-center mt-2">
              <v-btn
                color="primary"
                :disabled="!addCourseDayIsValid"
                @click="addCourseDay"
              >
                Add Day
              </v-btn>
            </div>
            <v-row
              no-gutters
              justify="center"
            >
              <v-col
                cols="12"
                md="6"
              >
                <v-data-table
                  dense
                  disable-sort
                  hide-default-footer
                  mobile-breakpoint="0"
                  no-data-text="Add a day above"
                  :headers="dayHeaders"
                  :items="addCourseDays"
                  :items-per-page="-1"
                >
                  <!-- eslint-disable-next-line vue/valid-v-slot -->
                  <template #item.number="{ item }">
                    {{ formatDayNumber(item.number) }}
                  </template>
                  <!-- eslint-disable-next-line vue/valid-v-slot -->
                  <template #item.start="{ item }">
                    {{ formatTime(item.start) }}
                  </template>
                  <!-- eslint-disable-next-line vue/valid-v-slot -->
                  <template #item.end="{ item }">
                    {{ formatTime(item.end) }}
                  </template>
                  <!-- eslint-disable-next-line vue/valid-v-slot -->
                  <template #item.remove="{ item }">
                    <v-btn
                      color="error"
                      icon
                      outlined
                      class="my-2"
                      @click="addCourseRemoveDay(item)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
            <div class="text-center mt-4">
              <v-btn
                color="primary"
                :disabled="!addCourseIsValid || addCourseDays.length === 0"
                @click="addCourse"
              >
                Add Course
              </v-btn>
            </div>
          </v-form>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <CoursePanel
        v-for="(course, i) in courses"
        :key="`course-${i}`"
        :course="course"
        :day-headers="dayHeaders"
        :course-name-rules="courseNameRules"
        :course-color-rules="courseColorRules"
        @save="saveCourse(i, $event)"
        @remove="courses.splice(i, 1)"
      />
    </v-expansion-panels>
    <v-sheet height="750">
      <v-calendar
        color="primary"
        type="week"
        now="2021-07-01"
        value="2021-08-01"
        first-interval="7"
        interval-count="15"
        interval-height="52"
        :events="calendarEvents"
      >
        <template #day-label-header>
          <span />
        </template>
        <template #event="{ event, eventParsed }">
          <div
            class="pa-1"
            style="white-space: normal;"
          >
            {{ event.name }}<br>
            {{ eventParsed.start.time }} - {{ eventParsed.end.time }}
          </div>
        </template>
      </v-calendar>
    </v-sheet>
  </div>
</template>

<script>
const requiredRule = v => !!v || 'Required'

export default {
  data: () => ({
    courses: [],
    addCourseDayNumber: '',
    addCourseDayStart: '',
    addCourseDayEnd: '',
    dayHeaders: [
      {
        text: 'Day',
        value: 'number',
        width: 116,
      },
      {
        text: 'Start',
        value: 'start',
        width: 64,
      },
      {
        text: 'End',
        value: 'end',
      },
      {
        text: '',
        value: 'remove',
        width: 36,
      },
    ],
    addCourseIsValid: false,
    addCourseName: '',
    addCourseColor: '',
    addCourseDays: [],
    courseNameRules: [
      requiredRule,
      v => !v || !/[^a-zA-Z0-9 -]/.test(v) || 'Letters, numbers, spaces, and hyphens only',
    ],
    courseColorRules: [
      requiredRule,
      v => !v || /^#[0-9a-fA-F]{6}$/.test(v) || 'Hexadecimal (#000000) only',
    ],
  }),
  computed: {
    calendarEvents() {
      return this.courses.reduce((events, course) => {
        course.days.forEach((day) => {
          events.push({
            name: course.name,
            color: course.color,
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
        query[index] = `${course.name}|${course.color}|${days}`
        return query
      }, {})
    },
    addCourseDayIsValid() {
      return this.addCourseDayNumber !== ''
        && this.addCourseDayStart && this.$refs.addCourseDayStartField?.isValid
        && this.addCourseDayEnd && this.$refs.addCourseDayEndField?.isValid
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
      const [name, color, ...days] = courseQuery.split('|')
      courses.push({
        name,
        color,
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
    formatDayNumber(number) {
      return this.$refs.addCourseDayField ? this.$refs.addCourseDayField.options[number].text : ''
    },
    formatTime(time) {
      return `${time.hours}:${time.minutes.toString().padStart(2, '0')}`
    },
    addCourseDay() {
      const [startHours, startMinutes] = this.addCourseDayStart.split(':')
      const [endHours, endMinutes] = this.addCourseDayEnd.split(':')
      this.addCourseDays.push({
        number: this.addCourseDayNumber,
        start: { hours: parseInt(startHours), minutes: parseInt(startMinutes) },
        end: { hours: parseInt(endHours), minutes: parseInt(endMinutes) },
      })
    },
    addCourseRemoveDay(day) {
      this.addCourseDays.splice(this.addCourseDays.indexOf(day), 1)
    },
    addCourse() {
      const days = []
      this.addCourseDays.forEach((day) => {
        days.push({
          number: day.number,
          start: { hours: day.start.hours, minutes: day.start.minutes },
          end: { hours: day.end.hours, minutes: day.end.minutes },
        })
      })
      this.courses.push({
        name: this.addCourseName,
        color: this.addCourseColor,
        days,
      })
      this.addCourseName = ''
      this.addCourseColor = ''
      this.$refs.addCourseForm.resetValidation()
    },
    saveCourse(index, course) {
      this.$set(this.courses, index, course)
    },
  },
}
</script>
