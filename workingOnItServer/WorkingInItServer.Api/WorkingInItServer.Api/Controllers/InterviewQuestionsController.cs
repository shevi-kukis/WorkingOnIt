using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using WorkingOnIt.Core.Dtos;
using WorkingOnIt.Core.InterfaceService;
using WorkingOnIt.Core.ModalsDto;

namespace WorkingInIt.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InterviewQuestionsController(IInterviewQuestionsService service, IHttpClientFactory httpClientFactory) : ControllerBase
    {
        private readonly IInterviewQuestionsService _service = service;
        private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;
        // GET: api/InterviewQuestions
        [HttpGet]
        public async Task<ActionResult<List<InterviewQuestionsDto>>> Get()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }

        // GET api/InterviewQuestions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InterviewQuestionsDto>> Get(int id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null)
                return NotFound();
            return Ok(result);
        }

        // POST api/InterviewQuestions
        [HttpPost]
        public async Task<ActionResult<InterviewQuestionsDto>> Post([FromBody] InterviewQuestionsDto value)
        {
            var result = await _service.AddAsync(value);
            return CreatedAtAction(nameof(Get), new { id = result.Id }, result);
        }

        // PUT api/InterviewQuestions/5
        [HttpPut("{id}")]
        public async Task<ActionResult<InterviewQuestionsDto>> Put(int id, [FromBody] InterviewQuestionsDto value)
        {
            var updatedQuestion = await _service.UpdateAsync(id, value);
            return Ok(updatedQuestion);
        }

        // DELETE api/InterviewQuestions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _service.DeleteAsync(id);
            if (!success)
                return NotFound();
            return NoContent();
        }
        [HttpPost("evaluate")]
        public async Task<IActionResult> EvaluateResponses([FromBody] EvaluateFeedbackRequest request)
        {
            Console.WriteLine(request.Feedback_List);
            if (request.Feedback_List == null || request.Feedback_List.Count == 0)
            {
                return BadRequest("Feedback list must be provided.");
            }

            var client = _httpClientFactory.CreateClient();
            var payload = new
            {
                feedback_list = request.Feedback_List
            };
            var pythonApiUrl = Environment.GetEnvironmentVariable("PYTHON_API");
            try
            {
                await client.GetAsync($"{pythonApiUrl}/ping");
                await Task.Delay(1500); // המתנה קטנה, ליתר ביטחון
            }
            catch (Exception ex)
            {
                // אפשר להתעלם או לרשום בלוג
            }
            var response = await client.PostAsJsonAsync(pythonApiUrl + "/evaluate_responses", payload);
            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                return StatusCode((int)response.StatusCode, $"Python server error: {error}");
            }

            var result = await response.Content.ReadAsStringAsync();
            return Ok(result);
        }
     
[HttpPost("check")]
       
        public async Task<IActionResult> CheckAnswer([FromBody] AnswerCheckRequest request)
        {
            if (string.IsNullOrEmpty(request.Question) || string.IsNullOrEmpty(request.Answer))
            {
                return BadRequest("Question and answer must be provided.");
            }

            var client = _httpClientFactory.CreateClient();
            var payload = new
            {
                question = request.Question,
                answer = request.Answer
            };
            var pythonApiUrl = Environment.GetEnvironmentVariable("PYTHON_API");
            try
            {
                await client.GetAsync($"{pythonApiUrl}/ping");
                await Task.Delay(1500); // המתנה קטנה, ליתר ביטחון
            }
            catch (Exception ex)
            {
                // אפשר להתעלם או לרשום בלוג
            }
            var response = await client.PostAsJsonAsync($"{pythonApiUrl}/check_answer", payload);
            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                return StatusCode((int)response.StatusCode, $"Python server error: {error}");
            }

            var result = await response.Content.ReadAsStringAsync();
            return Ok(result);
        }

    }
}
