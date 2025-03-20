using WorkingOnIt.Core.InterfaceRepository;
using WorkingOnIt.Data;

public class RepositoryManager : IRepositoryManager
{
    private readonly DataContext _dataContext;

    public IUserRepository userRepository { get; }
    public IResumeRepository resumeRepository { get; }
    public IInterviewQuestionsRepository interviewQuestionsRepository { get; }
    public IInterviewRepository interviewRepository { get; }

    public RepositoryManager(DataContext dataContext, IUserRepository userRepository,
        IResumeRepository resumeRepository, IInterviewQuestionsRepository interviewQuestionsRepository,
        IInterviewRepository interviewRepository)
    {
        _dataContext = dataContext;
        this.userRepository = userRepository;  
        this.resumeRepository = resumeRepository;
        this.interviewQuestionsRepository = interviewQuestionsRepository;
        this.interviewRepository = interviewRepository;
    }

    public async Task SaveAsync()
    {
        await _dataContext.SaveChangesAsync();
    }

}
