<template>
  <div class="pa-4">
    <v-expansion-panels class="mb-4">
      <v-expansion-panel class="blue-grey darken-4">
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
                <TimeField
                  v-model="editedDayStart"
                  label="Day Start"
                  :disabled="!isEditingSettings"
                />
              </v-col>
              <v-col
                cols="12"
                md="4"
                class="px-2"
              >
                <TimeField
                  v-model="editedDayEnd"
                  label="Day End"
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
                  label="Interval"
                  outlined
                  dense
                  suffix="minutes"
                  :disabled="!isEditingSettings"
                />
              </v-col>
              <v-col
                cols="12"
                class="px-2"
              >
                <v-checkbox
                  v-model="editedShowNumbers"
                  label="Show Period Numbers"
                  outlined
                  class="mt-0"
                  :disabled="!isEditingSettings"
                />
              </v-col>
            </v-row>
            <div class="text-center mt-4 mb-n4">
              <v-btn
                outlined
                class="mb-4"
                :color="isEditingSettings ? '' : 'primary'"
                @click="isEditingSettings ? resetSettings() : (isEditingSettings = true)"
              >
                {{ isEditingSettings ? 'Cancel' : 'Edit' }}
              </v-btn>
              <v-btn
                v-show="isEditingSettings"
                color="primary"
                outlined
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
      <v-expansion-panel class="blue-grey darken-4">
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
            <div class="text-center mt-2 mb-4">
              <v-btn
                color="primary"
                outlined
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
                  class="blue-grey darken-3"
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
                outlined
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
      :first-time="dayStart"
      :interval-count="intervalCount"
      :interval-minutes="intervalLength"
      :interval-format="actuallyShowNumbers ? formatInterval : null"
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
    <v-snackbar
      v-model="classAlertVisible"
      text
      top
      :timeout="(classAlertColor !== 'warning' ? 120 : 30) * 1000"
      :color="classAlertColor"
    >
      {{ classAlertMessage }}
    </v-snackbar>
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
    dayStart: '7:00',
    dayEnd: '22:00',
    intervalLength: 60,
    showNumbers: false,
    actuallyShowNumbers: false,
    editedDayStart: '7:00',
    editedDayEnd: '22:00',
    editedIntervalLength: 60,
    editedShowNumbers: false,
    editSettingsIsValid: false,
    isEditingSettings: false,
    classAlertVisible: false,
    classAlertColor: '',
    classAlertMessage: '',
    classTimeAlertAudio: null,
    classDismissedAlertAudio: null,
    classStartedAlertAudio: null,
    intervals: [],
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
      }, {
        dayStart: this.dayStart,
        dayEnd: this.dayEnd,
        intervalLength: this.intervalLength,
        showNumbers: this.showNumbers,
      })
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
    intervalCount() {
      const milliseconds = new Date(`8/1/2021 ${this.dayEnd}`).getTime() - new Date(`8/1/2021 ${this.dayStart}`).getTime()
      const seconds = milliseconds / 1000.0
      const minutes = seconds / 60.0
      const hours = minutes / 60.0
      return hours * 60.0 / this.intervalLength
    },
  },
  watch: {
    routeQuery() {
      if (JSON.stringify(this.$route.query) === JSON.stringify(this.routeQuery)) { return }
      this.$router.replace({ path: '/', query: this.routeQuery })
    },
  },
  created() {
    const { dayStart, dayEnd, intervalLength, showNumbers, ...urlCourses } = this.$route.query
    const courseObjs = Object.values(urlCourses)
    if (!dayStart) { return }
    this.dayStart = dayStart
    this.dayEnd = dayEnd
    this.intervalLength = parseInt(intervalLength)
    this.showNumbers = showNumbers === 'true'
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
    this.classTimeAlertAudio = new Audio('5minutes.wav')
    this.classDismissedAlertAudio = new Audio('dismissed.wav')
    this.classStartedAlertAudio = new Audio('started.wav')
    
    document.querySelectorAll('.v-calendar-daily__interval-text').forEach((interval) => {
      if (interval.innerText.length === 0) { return }
      this.intervals.push(interval.innerText)
    })
    
    setTimeout(() => {
      this.actuallyShowNumbers = this.showNumbers
    }, 100)
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
    formatInterval(interval) {
      let hour = interval.hour
      if (hour === 0) { hour = 12 } else if (hour > 12) { hour -= 12 }
      const formattedInterval = `${hour}${interval.minute > 0 ? ':' + interval.minute.toString().padStart(2, '0') : ''} ${interval.hour < 12 ? 'AM' : 'PM'}`
      return this.intervals.indexOf(formattedInterval) + 1
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
      this.addCourseDays = []
      this.$refs.addCourseForm.resetValidation()
    },
    saveCourse(index, course) {
      this.$set(this.courses, index, course)
    },
    updateTime() {
      setInterval(() => {
        const now = new Date()
        const hours = now.getHours()
        const minutes = now.getMinutes()
        this.cal.times.now.hour = hours
        this.cal.times.now.minute = minutes
        
        for (const course of this.courses) {
          for (const day of course.days) {
            if (day.number !== this.currentDay) { continue }
            if ((day.end.hours === hours && day.end.minutes - minutes === 5)
              || (day.end.hours + 1 === hours && day.end.minutes + (60 - minutes) === 5)) {
              this.classAlertVisible = true
              this.classAlertColor = 'warning'
              this.classAlertMessage = `5 minutes remaining for ${course.name}`
              this.classTimeAlertAudio.play()
              return
            }
            if (day.end.hours === hours && day.end.minutes === minutes) {
              this.classAlertVisible = true
              this.classAlertColor = 'error'
              this.classAlertMessage = `${course.name} is over!`
              this.classDismissedAlertAudio.play()
              return
            }
            if (day.start.hours === hours && day.start.minutes === minutes) {
              this.classAlertVisible = true
              this.classAlertColor = 'success'
              this.classAlertMessage = `${course.name} started!`
              this.classStartedAlertAudio.play()
              return
            }
          }
        }
      }, 60 * 1000)
    },
    saveSettings() {
      this.isEditingSettings = false
      this.dayStart = this.editedDayStart
      this.dayEnd = this.editedDayEnd
      this.intervalLength = this.editedIntervalLength
      this.showNumbers = this.editedShowNumbers
      this.actuallyShowNumbers = this.showNumbers
    },
    resetSettings() {
      this.isEditingSettings = false
      this.editedDayStart = this.dayStart
      this.editedDayEnd = this.dayEnd
      this.editedIntervalLength = this.intervalLength
      this.editedShowNumbers = this.showNumbers
    },
  },
}
</script>

<style lang="scss">
.v-current-time {
  height: 2px;
  background-color: #81D4FA;
  position: absolute;
  left: 0px;
  right: 0px;
  pointer-events: none;
}
</style>
