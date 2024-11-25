# MasteryQuest 🎓

A modern, adaptive online practice test platform built for students in grades 7-10. MasteryQuest uses sophisticated Computerized Adaptive Testing (CAT) to provide personalized learning experiences.

## 🌟 Features

### Authentication
- Email/password authentication
- Google OAuth integration
- Secure signup process with email verification

### Personalized Dashboard
- Intuitive user interface built with shadcn/ui
- Quick access to practice tests
- Progress tracking and performance analytics
- Personalized study recommendations

### Advanced Quiz System
- Computerized Adaptive Testing (CAT) implementation
- 20 MCQ questions per test
- Dynamic difficulty adjustment based on performance
- Topic-based question tagging (Algebra, Geometry, etc.)
- Real-time progress tracking

### Performance Analytics
- Detailed performance reports
- Topic-wise strength analysis
- Personalized improvement suggestions
- Progress tracking over time

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/)
- **API:** [tRPC](https://trpc.io/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Testing:** [Vitest](https://vitest.dev/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **Database:** [Drizzle](https://orm.drizzle.team) with PostgreSQL

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/manangulati9/masteryquest.git
cd masteryquest
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Run database migrations:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

## 🧪 Testing

MasteryQuest maintains high testing standards with comprehensive test coverage:

```bash
# Run tests
npm run test
```

### Test Coverage Areas

- Authentication flows (login/signup)
- Dashboard functionality
- Quiz system and CAT algorithm
- Result generation and analysis
- API endpoints and data validation


## 🔐 Security

- OAuth 2.0 implementation
- JWT token-based authentication
- CSRF protection
- Rate limiting
- Input sanitization

## 🎯 Requirements Fulfilled

✅ User Authentication (Email + Google OAuth)  
✅ Personalized Dashboard  
✅ Advanced Quiz System with CAT  
✅ Comprehensive Result Evaluation  
✅ 90%+ Test Coverage  
✅ Modern Tech Stack Implementation  
✅ Intuitive UI Design  

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 🙏 Acknowledgements

- [Educhamp and Catalyst Group](https://catalystgroup.solutions/) for the project requirements
- [shadcn](https://twitter.com/shadcn) for the amazing UI components
- All contributors and testers

---

Built with ❤️ by [Manan Gulati]
