using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FactsController(AppDbContext context) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Fact>>> GetFacts()
    {
        return await context.Facts.ToListAsync();
    }
    
    [HttpGet("{category}")]
    public async Task<ActionResult<IEnumerable<Fact>>> GetFact(string category)
    {
        return await context.Facts
            .Where(x => x.Category == category)
            .ToListAsync();
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Fact?>> GetFact(int id)
    {
        return await context.Facts.FirstOrDefaultAsync(x => x.Id == id);
    }

    [HttpPost]
    public async Task<ActionResult> CreateFact(Fact fact)
    {
        await context.Facts.AddAsync(fact);
        await context.SaveChangesAsync();
        return Created();
    }

    [HttpPut("{id:int}/voteInteresting")]
    public async Task<ActionResult> UpdateFactVoteInteresing(int id)
    {
        var fact = await context.Facts.FirstOrDefaultAsync(x => x.Id == id);

        if (fact is null)
        {
            return NotFound();
        }
        
        fact.VoteInteresting++;

        await context.SaveChangesAsync();

        return Ok();
    }
    
    [HttpPut("{id:int}/voteMindblowing")]
    public async Task<ActionResult> UpdateFactVoteMindblowing(int id)
    {
        var fact = await context.Facts.FirstOrDefaultAsync(x => x.Id == id);

        if (fact is null)
        {
            return NotFound();
        }
        
        fact.VoteMindblowing++;

        await context.SaveChangesAsync();

        return Ok();
    }
    
    [HttpPut("{id:int}/voteFalse")]
    public async Task<ActionResult> UpdateFactVoteFalse(int id)
    {
        var fact = await context.Facts.FirstOrDefaultAsync(x => x.Id == id);

        if (fact is null)
        {
            return NotFound();
        }
        
        fact.VoteFalse++;

        await context.SaveChangesAsync();

        return Ok();
    }
}