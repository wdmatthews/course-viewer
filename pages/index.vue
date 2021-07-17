<template>
  <div class="pa-4">
    <v-expansion-panels class="mb-4">
      <v-expansion-panel>
        <v-expansion-panel-header>Settings</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-form
            v-model="editSettingsIsValid"
            @submit.prevent
          >
            <v-row
              no-gutters
              class="ma-n2"
            >
              <v-col
                cols="12"
                md="4"
                class="px-2"
              >
                <v-select
                  v-model="editedDayStart"
                  label="Day Start"
                  outlined
                  item-text="text"
                  item-value="value"
                  :items="timeChoices"
                  :disabled="!isEditingSettings"
                />
              </v-col>
              <v-col
                cols="12"
                md="4"
                class="px-2"
              >
                <v-select
                  v-model="editedDayEnd"
                  label="Day End"
                  outlined
                  item-text="text"
                  item-value="value"
                  :items="timeChoices"
                  :disabled="!isEditingSettings"
                />
              </v-col>
              <v-col
                cols="12"
                md="4"
                class="px-2"
              >
                <v-text-field
                  v-model.number="editedIntervalLength"
                  label="Interval Length"
                  outlined
                  hint="Minutes"
                  persistent-hint
                  :disabled="!isEditingSettings"
                />
              </v-col>
            </v-row>
            <div class="text-center mt-4 mb-n4">
              <v-btn
                class="mb-4"
                :color="isEditingSettings ? '' : 'primary'"
                @click="isEditingSettings ? resetSettings() : (isEditingSettings = true)"
              >
                {{ isEditingSettings ? 'Cancel' : 'Edit' }}
              </v-btn>
              <v-btn
                v-show="isEditingSettings"
                color="primary"
                class="ml-4 mb-4"
                :disabled="!editSettingsIsValid"
                @click="saveSettings"
              >
                Save
              </v-btn>
            </div>
          </v-form>
        </v-expansion-panel-content>
      </v-expansion-panel>
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
                <ColorField v-model="addCourseColor" />
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
    <v-calendar
      ref="calendar"
      color="primary"
      :first-interval="dayStart * 60.0 / intervalLength"
      :interval-count="(dayEnd - dayStart) * 60.0 / intervalLength"
      :interval-minutes="intervalLength"
      :events="calendarEvents"
      :type="isMobile ? 'day' : 'week'"
      :now="`2021-07-0${isMobile ? currentDay + 1 : 1} ${today.getHours()}:${today.getMinutes()}`"
      :value="`2021-08-0${currentDay + 1}`"
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
          {{ formatTime({ hours: eventParsed.start.hour, minutes: eventParsed.start.minute }) }}
          -
          {{ formatTime({ hours: eventParsed.end.hour, minutes: eventParsed.end.minute }) }}
        </div>
      </template>
      <template #day-body="{ date, week }">
        <div
          v-show="!week[currentDay] || date === week[currentDay].date"
          class="v-current-time"
          :style="{ top: nowY }"
        />
      </template>
    </v-calendar>
  </div>
</template>

<script>
const requiredRule = v => !!v || 'Required'
const today = new Date()

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
      },
      {
        text: 'Start',
        value: 'start',
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
    addCourseColor: '#F44336',
    addCourseDays: [],
    courseNameRules: [
      requiredRule,
      v => !v || !/[^a-zA-Z0-9 -]/.test(v) || 'Letters, numbers, spaces, and hyphens only',
    ],
    courseColorRules: [
      requiredRule,
      v => !v || /^#[0-9a-fA-F]{6}$/.test(v) || 'Hexadecimal (#000000) only',
    ],
    today,
    currentDay: today.getDay(),
    ready: false,
    dayStart: 7,
    dayEnd: 22,
    intervalLength: 60,
    editedDayStart: 7,
    editedDayEnd: 22,
    editedIntervalLength: 60,
    editSettingsIsValid: false,
    isEditingSettings: false,
    timeChoices: [
      {
        text: '12:00 AM',
        value: 0,
      },
      {
        text: '1:00 AM',
        value: 1,
      },
      {
        text: '2:00 AM',
        value: 2,
      },
      {
        text: '3:00 AM',
        value: 3,
      },
      {
        text: '4:00 AM',
        value: 4,
      },
      {
        text: '5:00 AM',
        value: 5,
      },
      {
        text: '6:00 AM',
        value: 6,
      },
      {
        text: '7:00 AM',
        value: 7,
      },
      {
        text: '8:00 AM',
        value: 8,
      },
      {
        text: '9:00 AM',
        value: 9,
      },
      {
        text: '10:00 AM',
        value: 10,
      },
      {
        text: '11:00 AM',
        value: 11,
      },
      {
        text: '12:00 PM',
        value: 12,
      },
      {
        text: '1:00 PM',
        value: 13,
      },
      {
        text: '2:00 PM',
        value: 14,
      },
      {
        text: '3:00 PM',
        value: 15,
      },
      {
        text: '4:00 PM',
        value: 16,
      },
      {
        text: '5:00 PM',
        value: 17,
      },
      {
        text: '6:00 PM',
        value: 18,
      },
      {
        text: '7:00 PM',
        value: 19,
      },
      {
        text: '8:00 PM',
        value: 20,
      },
      {
        text: '9:00 PM',
        value: 21,
      },
      {
        text: '10:00 PM',
        value: 22,
      },
      {
        text: '11:00 PM',
        value: 23,
      },
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
      }, { dayStart: this.dayStart, dayEnd: this.dayEnd, intervalLength: this.intervalLength })
    },
    addCourseDayIsValid() {
      return this.addCourseDayNumber !== ''
        && this.addCourseDayStart && this.$refs.addCourseDayStartField?.isValid
        && this.addCourseDayEnd && this.$refs.addCourseDayEndField?.isValid
    },
    isMobile() {
      return this.$vuetify.breakpoint.xs || this.$vuetify.breakpoint.sm
    },
    cal() {
      return this.ready ? this.$refs.calendar : null
    },
    nowY() {
      return this.cal ? this.cal.timeToY(this.cal.times.now) + 'px' : '-10px'
    },
  },
  watch: {
    routeQuery() {
      if (JSON.stringify(this.$route.query) === JSON.stringify(this.routeQuery)) { return }
      this.$router.replace({ path: '/', query: this.routeQuery })
    },
  },
  created() {
    const { dayStart, dayEnd, intervalLength, ...urlCourses } = this.$route.query
    const courseObjs = Object.values(urlCourses)
    if (!dayStart) { return }
    this.dayStart = parseInt(dayStart)
    this.dayEnd = parseInt(dayEnd)
    this.intervalLength = parseInt(intervalLength)
    this.resetSettings()
    this.courses = courseObjs.reduce((courses, courseQuery) => {
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
  mounted() {
    this.ready = true
    this.updateTime()
  },
  methods: {
    courseDayToQuery(day) {
      return `${day.number},${day.start.hours},${day.start.minutes},${day.end.hours},${day.end.minutes}`
    },
    formatDayNumber(number) {
      return this.$refs.addCourseDayField ? this.$refs.addCourseDayField.options[number].text : ''
    },
    formatTime(time) {
      let hoursInt = time.hours
      const minutesInt = time.minutes
      const isAM = hoursInt < 12
      if (hoursInt === 0) { hoursInt = 12 }
      if (hoursInt > 12) { hoursInt -= 12 }
      return `${hoursInt.toString().padStart(2, '0')}:${minutesInt.toString().padStart(2, '0')} ${isAM ? 'AM' : 'PM'}`
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
      this.addCourseColor = '#F44336'
      this.$refs.addCourseForm.resetValidation()
    },
    saveCourse(index, course) {
      this.$set(this.courses, index, course)
    },
    updateTime() {
      setInterval(() => {
        const now = new Date()
        this.cal.times.now.hour = now.getHours()
        this.cal.times.now.minute = now.getMinutes()
      }, 60 * 1000)
    },
    saveSettings() {
      this.isEditingSettings = false
      this.dayStart = this.editedDayStart
      this.dayEnd = this.editedDayEnd
      this.intervalLength = this.editedIntervalLength
    },
    resetSettings() {
      this.isEditingSettings = false
      this.editedDayStart = this.dayStart
      this.editedDayEnd = this.dayEnd
      this.editedIntervalLength = this.intervalLength
    },
  },
}
</script>

<style lang="scss">
.v-current-time {
  height: 2px;
  background-color: #F44336;
  position: absolute;
  left: 0px;
  right: 0px;
  pointer-events: none;
}
</style>
