using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using WorkingOnIt.Core.Dtos;
using WorkingOnIt.Core.InterfaceService;

namespace WorkingInIt.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InterviewQuestionsController(IInterviewQuestionsService service) : ControllerBase
    {
        private readonly IInterviewQuestionsService _service = service;

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
    }
}
