let {AuthenticationError} = require("apollo-server")

module.exports = {
  Query: {
    hello(_, __, {user}) {
      let username = user ? user.fullname || user.email : "Guest"
      return `Hello ${username}!`
    },

    company(_, {id}, {db}) {
      let company = db.companies.get(id) //
      if (!company) {
        throw Error("Company not found") // ???
      }
      return company
    },

    companies(_, args, {db}) {
      return db.companies.list()
    },

    job(_, {id}, {db}) {
      let job = db.jobs.get(id)
      if (!job) {
        throw Error("Job not found") // ???
      }
      return job
    },

    jobs(_, args, {db}) {
      return db.jobs.list()
    },
  },

  Mutation: {
    createJob(_, {input}, {user, db}) {
      if (!user) {
        throw new AuthenticationError("Not Authorized")
      }
      let id = db.jobs.create({...input, userId: user.id})
      let job = db.jobs.get(id)
      return job
    },
  },

  Job: {
    company(job, {}, {db}) {
      return db.companies.get(job.companyId)
    },

    user(job, {}, {db}) {
      return db.users.get(job.userId)
    },
  },

  Company: {
    jobs(company, {}, {db}) {
      return db.jobs.list().filter(job => job.companyId == company.id)
    },

    users(company, {}, {db}) {
      return db.users.list().filter(user => user.id == company.userId)
    }
  }
}
